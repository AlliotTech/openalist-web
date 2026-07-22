type Base64urlString = string

export type PublicKeyCredentialDescriptorJSON = Omit<
  PublicKeyCredentialDescriptor,
  "id"
> & { id: Base64urlString }

export type CredentialCreationOptionsJSON = Omit<
  CredentialCreationOptions,
  "publicKey"
> & {
  publicKey: Omit<
    PublicKeyCredentialCreationOptions,
    "challenge" | "user" | "excludeCredentials"
  > & {
    challenge: Base64urlString
    user: Omit<PublicKeyCredentialUserEntity, "id"> & {
      id: Base64urlString
    }
    excludeCredentials?: PublicKeyCredentialDescriptorJSON[]
  }
}

export type CredentialRequestOptionsJSON = Omit<
  CredentialRequestOptions,
  "publicKey"
> & {
  publicKey?: Omit<
    PublicKeyCredentialRequestOptions,
    "challenge" | "allowCredentials"
  > & {
    challenge: Base64urlString
    allowCredentials?: PublicKeyCredentialDescriptorJSON[]
  }
}

type WebAuthnResponseJSON = {
  id: string
  rawId: Base64urlString
  type: PublicKeyCredentialType
  authenticatorAttachment?: string | null
  clientExtensionResults: AuthenticationExtensionsClientOutputs
  response: Record<string, unknown>
}

type SupportedExtensionResults = AuthenticationExtensionsClientOutputs & {
  appidExclude?: boolean
  credProps?: { rk: boolean }
}

export type RegistrationPublicKeyCredential = PublicKeyCredential & {
  toJSON(): WebAuthnResponseJSON
}

export type AuthenticationPublicKeyCredential = PublicKeyCredential & {
  toJSON(): WebAuthnResponseJSON
}

const base64urlToBuffer = (value: Base64urlString): ArrayBuffer => {
  const padding = "==".slice(0, (4 - (value.length % 4)) % 4)
  const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/") + padding)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes.buffer
}

const bufferToBase64url = (value: ArrayBuffer): Base64urlString => {
  const bytes = new Uint8Array(value)
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

const parseDescriptors = (values?: PublicKeyCredentialDescriptorJSON[]) =>
  values?.map(({ id, ...descriptor }) => ({
    ...descriptor,
    id: base64urlToBuffer(id),
  }))

export const parseCreationOptionsFromJSON = (
  options: CredentialCreationOptionsJSON,
): CredentialCreationOptions => ({
  ...options,
  publicKey: {
    ...options.publicKey,
    challenge: base64urlToBuffer(options.publicKey.challenge),
    user: {
      ...options.publicKey.user,
      id: base64urlToBuffer(options.publicKey.user.id),
    },
    excludeCredentials: parseDescriptors(options.publicKey.excludeCredentials),
  },
})

export const parseRequestOptionsFromJSON = (
  options: CredentialRequestOptionsJSON,
): CredentialRequestOptions => ({
  ...options,
  publicKey: options.publicKey
    ? {
        ...options.publicKey,
        challenge: base64urlToBuffer(options.publicKey.challenge),
        allowCredentials: parseDescriptors(options.publicKey.allowCredentials),
      }
    : undefined,
})

const credentialToJSON = (
  credential: PublicKeyCredential,
): WebAuthnResponseJSON => {
  const response = credential.response
  const extensions =
    credential.getClientExtensionResults() as SupportedExtensionResults
  const common = {
    id: credential.id,
    rawId: bufferToBase64url(credential.rawId),
    type: credential.type as PublicKeyCredentialType,
    authenticatorAttachment: credential.authenticatorAttachment,
    clientExtensionResults: {
      appid: extensions.appid,
      appidExclude: extensions.appidExclude,
      credProps: extensions.credProps,
    },
  }
  if ("attestationObject" in response) {
    const attestation = response as AuthenticatorAttestationResponse
    return {
      ...common,
      response: {
        clientDataJSON: bufferToBase64url(attestation.clientDataJSON),
        attestationObject: bufferToBase64url(attestation.attestationObject),
        transports: attestation.getTransports?.() ?? [],
      },
    }
  }
  const assertion = response as AuthenticatorAssertionResponse
  return {
    ...common,
    response: {
      clientDataJSON: bufferToBase64url(assertion.clientDataJSON),
      authenticatorData: bufferToBase64url(assertion.authenticatorData),
      signature: bufferToBase64url(assertion.signature),
      userHandle: assertion.userHandle
        ? bufferToBase64url(assertion.userHandle)
        : null,
    },
  }
}

const attachToJSON = <T extends PublicKeyCredential>(credential: T) => {
  Object.defineProperty(credential, "toJSON", {
    configurable: true,
    value: () => credentialToJSON(credential),
  })
  return credential
}

export const create = async (options: CredentialCreationOptions) => {
  const credential = (await navigator.credentials.create(
    options,
  )) as PublicKeyCredential | null
  if (!credential)
    throw new Error("WebAuthn registration returned no credential")
  return attachToJSON(credential) as RegistrationPublicKeyCredential
}

export const get = async (options: CredentialRequestOptions) => {
  const credential = (await navigator.credentials.get(
    options,
  )) as PublicKeyCredential | null
  if (!credential)
    throw new Error("WebAuthn authentication returned no credential")
  return attachToJSON(credential) as AuthenticationPublicKeyCredential
}

export const supported = () =>
  navigator.credentials != null && typeof PublicKeyCredential !== "undefined"
