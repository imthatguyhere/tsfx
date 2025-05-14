export function ServerOnly(target: Object, key: string | symbol, descriptor: PropertyDescriptor) {
    if (!IsDuplicityVersion()) {
        console.warn(`Attempted to run Server-Side method '${String(key)}' on the client`);
        descriptor.value = () => {};
    }
}
