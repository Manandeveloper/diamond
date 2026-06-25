// Diamond Vertex Shader
// Computes world-space position, normal, and view direction for the fragment shader

varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
varying vec3 vViewDir;
varying vec3 vNormal;
varying vec3 vLocalPosition;
varying vec3 vLocalNormal;

void main() {
    // World-space position
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    
    // World-space normal (using modelMatrix cast to mat3 for correct scaling/rotation)
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vNormal = normalize(normalMatrix * normal);
    
    // View direction: from camera to vertex (world space)
    vViewDir = normalize(worldPos.xyz - cameraPosition);
    
    // Local-space attributes
    vLocalPosition = position;
    vLocalNormal = normal;
    
    gl_Position = projectionMatrix * viewMatrix * worldPos;
}
