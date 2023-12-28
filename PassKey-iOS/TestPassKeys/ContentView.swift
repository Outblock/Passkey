//
//  ContentView.swift
//  TestPassKeys
//
//  Created by Hao Fu on 17/9/2023.
//

import Flow
import SwiftUI

struct ContentView: View {
    @State
    var username: String = ""

    @StateObject
    var handler = PasskeyHandler()

    @State
    var hidden: Bool = true

    @FocusState
    private var focusedField: Bool?

    func publicKeySection(key: String, title: String = "Public Key") -> some View {
        Section {
            Text(key)
                .lineLimit(1)
                .truncationMode(.middle)
            HStack(alignment: /*@START_MENU_TOKEN@*/ .center/*@END_MENU_TOKEN@*/) {
                Spacer()
                Label("SHA-256", systemImage: "number")
                Spacer()
                Divider()
                Spacer()
                Label("P-256", systemImage: "water.waves")
                Spacer()
            }
            .font(.caption)
            .foregroundColor(.gray)
        } header: {
            Label(title, systemImage: "key.fill")
        }
    }

    var seedPhraseSection: some View {
        Section {
            Text(handler.seedPhrase)
            HStack {
                Label("BIP44", systemImage: "point.topleft.down.to.point.bottomright.curvepath")
                Divider()
                Text(Constant.flowPath)
            }
            .font(.caption)
            .foregroundColor(.gray)
        } header: {
            Label("Seed Phrase", systemImage: "text.word.spacing")
        }
    }

    var signSection: some View {
        Section {
            Button {
                handler.register()
            } label: {
                Label("Sign User Message",
                      systemImage: "pencil.and.scribble")
                    .padding(EdgeInsets(top: 0, leading: 0, bottom: 0, trailing: 20))
            }

            Button {
                handler.register()
            } label: {
                Label("Send transaction",
                      systemImage: "paperplane.fill")
                    .padding(EdgeInsets(top: 0, leading: 0, bottom: 0, trailing: 20))
            }

        } header: {
            Label("Sign", systemImage: "pencil.and.outline")
        }
    }

    var entropySection: some View {
        Section {
            Text(handler.entropyStr)
                .lineLimit(1)
                .truncationMode(.middle)

        } header: {
            Label("Entropy", systemImage: "chart.dots.scatter")
        }
    }

    var userSection: some View {
        Section {
            List {
                TextField("Username", text: $handler.username)
                    .focused($focusedField, equals: true)

                Button {
                    handler.register()
                } label: {
                    Label("Register",
                          systemImage: "person.fill.badge.plus")
                        .padding(EdgeInsets(top: 0, leading: 0, bottom: 0, trailing: 20))
                }

                Button {
                    handler.signIn()
                } label: {
                    Label("Sign In",
                          systemImage: "person.badge.key.fill")
                        .padding(EdgeInsets(top: 0, leading: 0, bottom: 0, trailing: 20))
                }
            }
        } header: {
            Label("User", systemImage: "person.fill")
        }
    }

    var showButton: some View {
        Section {
            Button {
                withAnimation {
                    hidden.toggle()
                }
            } label: {
                Label(hidden ? "show" : "hide", systemImage: hidden ? "chevron.down" : "chevron.up")
            }
        }
        .listRowBackground(Color(UIColor.clear))
    }

    var body: some View {
        NavigationView {
            Form {
                userSection

//                signSection

                entropySection

                seedPhraseSection

                publicKeySection(key: handler.publicKey)

                showButton

                if hidden {
                    publicKeySection(key: handler.passkeyPublicKey, title: "PassKey - Public Key")
                        .transition(.scale.combined(with: .opacity))
                }
            }
            .navigationTitle("PassKey")
            .toolbar {
                ToolbarItem(placement: .keyboard) {
                    HStack {
                        Spacer()
                        Button("Done") {
                            focusedField = nil
                        }
                    }
                }
            }
        }
    }
}

#Preview {
    ContentView()
}
