// Helper functions for SHA-256 operations
function ROTR(n, x) {
    return (x >>> n) | (x << (32 - n));
}