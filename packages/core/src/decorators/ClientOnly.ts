export function ClientOnly(target: Object, key: string | symbol, descriptor: PropertyDescriptor) {
    if (IsDuplicityVersion()) {
        console.warn(`Attempted to run Client-Side method '${String(key)}' on the server`);
        descriptor.value = () => {};
    }
}
