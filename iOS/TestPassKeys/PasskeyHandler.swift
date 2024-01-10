//
//  PasskeyHandler.swift
//  TestPassKeys
//
//  Created by Hao Fu on 17/9/2023.
//

import Foundation
import AuthenticationServices
import SwiftCBOR
import Flow
import WalletCore
import SPIndicator
import SwiftUI

struct Constant {
    static let entropyCount = 16
    static let domain = "tesnet.passkey.lilico.dev"
    static let flowPath = "m/44'/539'/0'/0/0"
}

class PasskeyHandler: NSObject, ObservableObject, ASAuthorizationControllerPresentationContextProviding {

    @AppStorage("userIndex")
    var userIndex: Int = 0

    var entropyStr: String {
        entropy?.hexValue ?? ""
    }

    @Published
    var entropy: Data?

    @Published
    var username: String = "Test Username"

    var hdWallet: HDWallet? {
        guard let entropy else {
            return nil
        }
        return HDWallet(entropy: entropy, passphrase: "")
    }

    var seedPhrase: String {
        hdWallet?.mnemonic ?? ""
    }

    var publicKey: String {
        hdWallet?.getKeyByCurve(curve: .nist256p1, derivationPath: Constant.flowPath)
            .getPublicKeyByType(pubkeyType: .nist256p1)
            .uncompressed
            .data
            .hexValue ?? ""
    }

    var passkeyPublicKey: String = ""

    enum Action {
        case register(challenge: Data, name: String, userID: Data)
        case signin(challenge: Data)

        var challenge: Data {
            switch self {
            case let .signin(challenge):
                return challenge
            case let .register(challenge, _, _):
                return challenge
            }
        }
    }

    func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor {
        return ASPresentationAnchor()
    }

    func randomChallenage(length: Int = 32) -> Data {
        let bytes = [UInt32](repeating: 0, count: length).map { _ in arc4random() }
        return Data(bytes: bytes, count: length)
    }

    func register() {
        guard let entropy = Data(random: Constant.entropyCount) else {
            return
        }
        self.entropy = entropy
        performAction(action: .register(challenge: randomChallenage(), name: "\(userIndex) - \(username)", userID: entropy))
    }

    func signIn() {
        performAction(action: .signin(challenge: randomChallenage()))
    }

    func request(provider: ASAuthorizationPlatformPublicKeyCredentialProvider, action: Action) -> ASAuthorizationRequest {
        switch action {
        case let .signin(challenge):
            return provider.createCredentialAssertionRequest(challenge: challenge)
        case let .register(challenge, name, userID):
            return provider.createCredentialRegistrationRequest(challenge: challenge, name: name, userID: userID)
        }
    }

    func performAction(action: Action) {
        let platformProvider = ASAuthorizationPlatformPublicKeyCredentialProvider(relyingPartyIdentifier: Constant.domain)
        let platformKeyRequest = request(provider: platformProvider, action: action)
        let authController = ASAuthorizationController(authorizationRequests: [platformKeyRequest])

        print("challenge ==> \(action.challenge.base64EncodedString())")
        print("challenge ==> \(action.challenge.hexValue)")

        authController.delegate = self
        authController.presentationContextProvider = self
        authController.performRequests()
    }

    private func showAlert(with title: String, message: String) {
//      let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
//      alert.addAction(UIAlertAction(title: "OK", style: .default))
//      present(alert, animated: false)

        SPIndicator.present(title: title, message: message, haptic: .error)
        print("\(title) === \(message)")
    }
}

extension PasskeyHandler: ASAuthorizationControllerDelegate {
    func authorizationController(controller: ASAuthorizationController, didCompleteWithAuthorization authorization: ASAuthorization) {
      if let credential = authorization.credential as? ASAuthorizationPlatformPublicKeyCredentialRegistration {
          userIndex += 1
        showAlert(with: "Authorized with Passkeys", message: "Create account with credential ID = \(credential.credentialID)")
          print("credentialID ==> \(credential.credentialID.hexValue)")
          let string = String(data: credential.rawClientDataJSON, encoding: .utf8)
          print(string)
          do {
              let attestationObjectBytes = [UInt8](credential.rawAttestationObject!)

               if case let .map(decodedAttestationObject) = try CBOR.decode(attestationObjectBytes) {
                   print("Successfully decoded Attestation object (CBOR) ==> \(decodedAttestationObject)")

                   if case let .byteString(authData) = decodedAttestationObject["authData"] {

                       let attestedCredentialData = [UInt8](authData.dropFirst(37))

                       let credentialIdLengthBuffer = [UInt8](attestedCredentialData[16..<18])
                       let credentialIdLength = Int(credentialIdLengthBuffer.reversed().withUnsafeBytes { $0.load(as: UInt16.self) })
                       let credentialId = [UInt8](attestedCredentialData[18..<(18 + credentialIdLength)])
                       let credentialPublicKeyBuffer = [UInt8](attestedCredentialData.dropFirst(18 + credentialIdLength))

                       if let decodedCredentialPublicKey = try CBOR.decode(credentialPublicKeyBuffer) {

                           if
                               case let .byteString(xCoordinateBuffer) = decodedCredentialPublicKey[-2],
                               case let .byteString(yCoordinateBuffer) = decodedCredentialPublicKey[-3]
                           {

                               let key = xCoordinateBuffer + yCoordinateBuffer
                               let hashValue = Data(key).hexValue

                               print("hashValue ==> \(hashValue)")

                               let xCoordinateLength = xCoordinateBuffer.count
                               let yCoordinateLength = yCoordinateBuffer.count

                               if xCoordinateLength != yCoordinateLength {
                                print(": X/Y Coordinate length mismatch! X: \(xCoordinateLength), Y: \(yCoordinateLength)")
                               } else if xCoordinateLength != 32 || yCoordinateLength != 32 {
                                print(": X/Y Coordinate length mismatch! X: \(xCoordinateLength), Y: \(yCoordinateLength)")
                               } else {
                                print(": X/Y Coordinates OK")
                                   passkeyPublicKey = Data(xCoordinateBuffer + yCoordinateBuffer).hexValue
                               }
                           }
                       }
                   }
               }
           } catch {
               print("Error decoding Attestation object (CBOR): \(error)")
           }

        // Take steps to handle the registration.
      } else if let credential = authorization.credential as? ASAuthorizationPlatformPublicKeyCredentialAssertion {
          showAlert(with: "Authorized with Passkeys", message: "Sign in with credential ID = \(credential.credentialID)")
          let signature = credential.signature
          let clientDataJSON = credential.rawClientDataJSON

          let string = String(data: credential.rawClientDataJSON, encoding: .utf8)
          guard let model = try? JSONDecoder().decode(WebAuth.self, from: credential.rawClientDataJSON) else {
              return 
          }
          let base64 = model.challenge.replacingOccurrences(of: "-", with: "+").replacingOccurrences(of: "_", with: "/")
          let cString = Data(base64Encoded: base64)?.hexValue
          print(string)
          print("cString ==> \(cString)")
          print("credentialID ==> \(credential.credentialID.hexValue)")
          print("userID ==> \(credential.userID.hexValue)")
          print("userID ==> \(String(data: credential.userID, encoding: .utf8))")
          print("rawAuthenticatorData ==> \(credential.rawAuthenticatorData.hexValue)")
          print("signature ==> \(signature?.hexValue)")

          self.entropy = credential.userID

          let cbor = try? CBOR.decode([UInt8](credential.rawAuthenticatorData!))
          print(cbor)

        // Take steps to verify the challenge by sending it to your server tio verify
      } else {
        showAlert(with: "Authorized", message: "e.g. with \"Sign in with Apple\"")
        // Handle other authentication cases, such as Sign in with Apple.
      }
    }

    func authorizationController(controller: ASAuthorizationController, didCompleteWithError error: Error) {
      showAlert(with: "Error", message: error.localizedDescription)
    }
}

struct WebAuth: Codable {
    let type: String
    let challenge: String
    let origin: URL
}
