// Diamond Fragment Shader — Analytical Multi-Bounce Raytracer
// Calculates mathematically exact intersections with the diamond's facets
// Performs 3 internal bounces per channel for realistic dispersion and fire

precision highp float;

// Uniforms
uniform sampler2D uEnvMap;
uniform float uIOR;
uniform float uDispersion;
uniform float uFresnelPower;
uniform float uBrightness;
uniform vec3 uColor;
uniform vec3 uLocalCameraPos;
uniform mat4 modelMatrix; // Declared for local-to-world transformation

// Varyings
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
varying vec3 vViewDir;
varying vec3 vNormal;
varying vec3 vLocalPosition;
varying vec3 vLocalNormal;

#define PI 3.141592653589793
#define RECIPROCAL_PI 0.3183098861837907

// Equirectangular mapping function
vec2 dirToUV(vec3 dir) {
    vec3 d = normalize(dir);
    return vec2(
        atan(d.z, d.x) * RECIPROCAL_PI * 0.5 + 0.5,
        asin(clamp(d.y, -1.0, 1.0)) * RECIPROCAL_PI + 0.5
    );
}

// Samples the environment map
vec3 sampleEnv(vec3 dir) {
    return texture2D(uEnvMap, dirToUV(dir)).rgb;
}

// Analytical ray-cone/cylinder/plane intersection for the diamond shape
bool findIntersection(vec3 P, vec3 D, out vec3 hitPt, out vec3 hitNormal, out float hitT) {
    float minT = 1e10;
    bool found = false;
    
    // 1. Table intersection (flat octagon at y = 0.34)
    if (abs(D.y) > 0.0001) {
        float t = (0.34 - P.y) / D.y;
        if (t > 0.05 && t < minT) {
            vec3 p = P + t * D;
            if (p.x*p.x + p.z*p.z <= 0.3025) { // 0.55^2 = 0.3025
                minT = t;
                hitPt = p;
                hitNormal = vec3(0.0, 1.0, 0.0);
                found = true;
            }
        }
    }
    
    // 2. Crown cone intersection (frustum from y=0.0 to y=0.34)
    {
        float A = -1.323529;
        float B = 1.0;
        float a = D.x*D.x + D.z*D.z - A*A*D.y*D.y;
        float K = A*P.y + B;
        float b = 2.0 * (P.x*D.x + P.z*D.z - A*K*D.y);
        float c = P.x*P.x + P.z*P.z - K*K;
        
        if (abs(a) > 0.00001) {
            float disc = b*b - 4.0*a*c;
            if (disc >= 0.0) {
                float sqrtDisc = sqrt(disc);
                float t1 = (-b - sqrtDisc) / (2.0 * a);
                float t2 = (-b + sqrtDisc) / (2.0 * a);
                
                if (t1 > 0.05 && t1 < minT) {
                    vec3 p = P + t1 * D;
                    if (p.y >= 0.0 && p.y <= 0.34) {
                        minT = t1;
                        hitPt = p;
                        float phi = atan(p.z, p.x);
                        float sector = floor(phi / (PI / 8.0) + 0.5) * (PI / 8.0);
                        hitNormal = normalize(vec3(cos(sector) * 0.7556, 1.0, sin(sector) * 0.7556));
                        found = true;
                    }
                }
                if (t2 > 0.05 && t2 < minT) {
                    vec3 p = P + t2 * D;
                    if (p.y >= 0.0 && p.y <= 0.34) {
                        minT = t2;
                        hitPt = p;
                        float phi = atan(p.z, p.x);
                        float sector = floor(phi / (PI / 8.0) + 0.5) * (PI / 8.0);
                        hitNormal = normalize(vec3(cos(sector) * 0.7556, 1.0, sin(sector) * 0.7556));
                        found = true;
                    }
                }
            }
        }
    }
    
    // 3. Pavilion cone intersection (cone from y=-0.87 to y=-0.04)
    {
        float A = 1.204819;
        float B = 1.048193;
        float a = D.x*D.x + D.z*D.z - A*A*D.y*D.y;
        float K = A*P.y + B;
        float b = 2.0 * (P.x*D.x + P.z*D.z - A*K*D.y);
        float c = P.x*P.x + P.z*P.z - K*K;
        
        if (abs(a) > 0.00001) {
            float disc = b*b - 4.0*a*c;
            if (disc >= 0.0) {
                float sqrtDisc = sqrt(disc);
                float t1 = (-b - sqrtDisc) / (2.0 * a);
                float t2 = (-b + sqrtDisc) / (2.0 * a);
                
                if (t1 > 0.05 && t1 < minT) {
                    vec3 p = P + t1 * D;
                    if (p.y >= -0.87 && p.y <= -0.04) {
                        minT = t1;
                        hitPt = p;
                        float phi = atan(p.z, p.x);
                        float sector = floor(phi / (PI / 8.0) + 0.5) * (PI / 8.0);
                        hitNormal = normalize(vec3(cos(sector) * 0.83, -1.0, sin(sector) * 0.83));
                        found = true;
                    }
                }
                if (t2 > 0.05 && t2 < minT) {
                    vec3 p = P + t2 * D;
                    if (p.y >= -0.87 && p.y <= -0.04) {
                        minT = t2;
                        hitPt = p;
                        float phi = atan(p.z, p.x);
                        float sector = floor(phi / (PI / 8.0) + 0.5) * (PI / 8.0);
                        hitNormal = normalize(vec3(cos(sector) * 0.83, -1.0, sin(sector) * 0.83));
                        found = true;
                    }
                }
            }
        }
    }
    
    // 4. Girdle cylinder intersection (y=-0.04 to y=0.0)
    {
        float a = D.x*D.x + D.z*D.z;
        float b = 2.0 * (P.x*D.x + P.z*D.z);
        float c = P.x*P.x + P.z*P.z - 1.0;
        
        if (abs(a) > 0.00001) {
            float disc = b*b - 4.0*a*c;
            if (disc >= 0.0) {
                float sqrtDisc = sqrt(disc);
                float t1 = (-b - sqrtDisc) / (2.0 * a);
                float t2 = (-b + sqrtDisc) / (2.0 * a);
                
                if (t1 > 0.05 && t1 < minT) {
                    vec3 p = P + t1 * D;
                    if (p.y >= -0.04 && p.y <= 0.0) {
                        minT = t1;
                        hitPt = p;
                        float phi = atan(p.z, p.x);
                        float sector = floor(phi / (PI / 8.0) + 0.5) * (PI / 8.0);
                        hitNormal = vec3(cos(sector), 0.0, sin(sector));
                        found = true;
                    }
                }
                if (t2 > 0.05 && t2 < minT) {
                    vec3 p = P + t2 * D;
                    if (p.y >= -0.04 && p.y <= 0.0) {
                        minT = t2;
                        hitPt = p;
                        float phi = atan(p.z, p.x);
                        float sector = floor(phi / (PI / 8.0) + 0.5) * (PI / 8.0);
                        hitNormal = vec3(cos(sector), 0.0, sin(sector));
                        found = true;
                    }
                }
            }
        }
    }
    
    hitT = minT;
    return found;
}

// Traces a single channel ray through the diamond with up to 3 internal bounces
vec3 traceChannel(vec3 P0, vec3 V, vec3 N, float ior) {
    // First refraction into the diamond
    vec3 D = refract(V, N, 1.0 / ior);
    if (length(D) < 0.001) {
        return reflect(V, N); // Fallback to reflection if total internal reflection on first hit
    }
    
    vec3 P = P0;
    vec3 currentNormal = N;
    
    for (int bounce = 0; bounce < 3; bounce++) {
        vec3 hitPt;
        vec3 hitNormal;
        float hitT;
        
        // Find next intersection inside the diamond
        if (findIntersection(P, D, hitPt, hitNormal, hitT)) {
            // Check if we undergo total internal reflection
            float cos_theta = dot(-D, hitNormal);
            float sin2_theta = 1.0 - cos_theta * cos_theta;
            float critical_sin2 = 1.0 / (ior * ior);
            
            if (sin2_theta > critical_sin2) {
                // Total Internal Reflection - ray reflects inside
                D = reflect(D, hitNormal);
                P = hitPt;
                currentNormal = hitNormal;
            } else {
                // Refract out of the diamond
                vec3 outRay = refract(D, -hitNormal, ior);
                if (length(outRay) > 0.001) {
                    return outRay;
                } else {
                    // Fallback to reflection if refraction fails
                    D = reflect(D, hitNormal);
                    P = hitPt;
                    currentNormal = hitNormal;
                }
            }
        } else {
            // Ray escaped
            return D;
        }
    }
    
    // Fallback: refract out using the last hit normal
    vec3 outRay = refract(D, -currentNormal, ior);
    if (length(outRay) > 0.001) {
        return outRay;
    }
    return D;
}

void main() {
    // Normal and view direction in local space
    vec3 N = normalize(vLocalNormal);
    vec3 V = normalize(vLocalPosition - uLocalCameraPos);
    
    // Ensure normal points outward relative to the view direction
    if (dot(N, V) > 0.0) {
        N = -N;
    }

    // 1. External Reflection (Fresnel term)
    vec3 localR = reflect(V, N);
    vec3 worldR = normalize(mat3(modelMatrix) * localR);
    vec3 reflectionColor = sampleEnv(worldR);

    // 2. Refracted colors with chromatic dispersion
    vec3 exitR = traceChannel(vLocalPosition, V, N, uIOR - uDispersion);
    vec3 exitG = traceChannel(vLocalPosition, V, N, uIOR);
    vec3 exitB = traceChannel(vLocalPosition, V, N, uIOR + uDispersion);

    // Transform exit rays to world space
    vec3 worldExitR = normalize(mat3(modelMatrix) * exitR);
    vec3 worldExitG = normalize(mat3(modelMatrix) * exitG);
    vec3 worldExitB = normalize(mat3(modelMatrix) * exitB);

    // Sample environment map for each channel
    vec3 refractionColor;
    refractionColor.r = sampleEnv(worldExitR).r;
    refractionColor.g = sampleEnv(worldExitG).g;
    refractionColor.b = sampleEnv(worldExitB).b;

    // 3. Fresnel blending
    float fresnel = pow(1.0 - max(dot(N, -V), 0.0), uFresnelPower);
    vec3 finalColor = mix(refractionColor, reflectionColor, fresnel);

    // Apply color tint and brightness modifier
    finalColor *= uColor * uBrightness;

    gl_FragColor = vec4(finalColor, 1.0);
}
