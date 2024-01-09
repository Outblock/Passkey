export function serviceDefinition(address, keyId, type, network, opts = {}) {
    const definition = {
      f_type: 'Service',
      f_vsn: '1.0.0',
      type: type,
      uid: `fcw#${type}`,
      network: network || 'unknown',
      endpoint: window.location.origin,
    }
  
    if (type === 'authn') {
      definition.id = address
      definition.identity = {
        address: address,
      }
      definition.provider = {
        f_type: 'ServiceProvider',
        f_vsn: '1.0.0',
        address: address, 
        name: 'MONO',
        icon: 'https://lilico.app/fcw-logo.png',
        description: 'A wallet created for everyone.',
      }
    }
  
    if (type === 'authz') {
      definition.method = 'EXT/RPC'
      definition.identity = {
        address: address,
        keyId: Number(keyId),
      }
    }
  
    if (type === 'pre-authz') {
      definition.method = 'EXT/RPC'
      definition.data = {
        address: address,
        keyId: Number(keyId),
      }
    }
  
    if (type === 'user-signature') {
      definition.method = 'EXT/RPC'
    }
  
    if (type === 'account-proof') {
      definition.method = 'EXT/RPC'
      definition.data = opts
    }
  
    return definition
  }
  
  export function preAuthzServiceDefinition(address, keyId, payerAddress, payerKeyId, network) {
    return {
      f_type: 'PreAuthzResponse',
      f_vsn: '1.0.0',
      proposer: serviceDefinition(address, keyId, 'authz', network),
      payer: [serviceDefinition(payerAddress, payerKeyId, 'authz', network)],
      authorization: [serviceDefinition(address, keyId, 'authz', network)],
    }
  }
  
  export async function authnServiceDefinition(address, keyId, payerAddress, payerKeyId, isEnabled = false, network) {
    const services = [
      serviceDefinition(address, keyId, 'authn', network),
      serviceDefinition(address, keyId, 'authz', network),
      serviceDefinition(address, keyId, 'user-signature', network),
    ]
  
    // const isEnabled = await walletController.allowLilicoPay();
    if(isEnabled) {
      services.push(serviceDefinition(payerAddress, payerKeyId, 'pre-authz', network),)
    }
    return services
  }
  