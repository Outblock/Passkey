//
//  Extension.swift
//  TestPassKeys
//
//  Created by Hao Fu on 18/12/2023.
//

import Foundation

extension Data {
    init?(random count: Int) {
        var keyData = Data(count: count)
        let result = keyData.withUnsafeMutableBytes {
            SecRandomCopyBytes(kSecRandomDefault, count, $0.baseAddress!)
        }
        if result == errSecSuccess {
            self = keyData
        } else {
            print("Problem generating random bytes")
            return nil
        }
    }

    var hexValue: String {
        return reduce("") { $0 + String(format: "%02x", $1) }
    }
}
