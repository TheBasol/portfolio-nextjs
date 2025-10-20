// Vertex shader como string
export const vertexShader =  `
    uniform float uTime;
    varying float vElevation;
    varying vec3 vPosition;
    varying vec3 vNormal;

    // --- Funciones de Ruido (snoise, fbm) ---
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) { const vec2 C = vec2(1.0/6.0, 1.0/3.0) ; const vec4 D = vec4(0.0, 0.5, 1.0, 2.0); vec3 i = floor(v + dot(v, C.yyy) ); vec3 x0 = v - i + dot(i, C.xxx) ; vec3 g = step(x0.yzz, x0.xyz); vec3 l = 1.0 - g; vec3 i1 = min( g.xyz, l.zxy ); vec3 i2 = max( g.xyz, l.zxy ); vec3 x1 = x0 - i1 + C.xxx; vec3 x2 = x0 - i2 + C.yyy; vec3 x3 = x0 - D.yyy; i = mod289(i); vec4 p = permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ); float n_ = 0.142857142857; vec3 ns = n_ * D.wyz - D.xzx; vec4 j = p - 49.0 * floor(p * ns.z * ns.z); vec4 x_ = floor(j * ns.z); vec4 y_ = floor(j - 7.0 * x_); vec4 x = x_ *ns.x + ns.yyyy; vec4 y = y_ *ns.x + ns.yyyy; vec4 h = 1.0 - abs(x) - abs(y); vec4 b0 = vec4( x.xy, y.xy ); vec4 b1 = vec4( x.zw, y.zw ); vec4 s0 = floor(b0)*2.0 + 1.0; vec4 s1 = floor(b1)*2.0 + 1.0; vec4 sh = -step(h, vec4(0.0)); vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ; vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ; vec3 p0 = vec3(a0.xy,h.x); vec3 p1 = vec3(a0.zw,h.y); vec3 p2 = vec3(a1.xy,h.z); vec3 p3 = vec3(a1.zw,h.w); vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3))); p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w; vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0); m = m * m; return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) ); }

    float fbm(vec3 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 4; i++) {
            value += amplitude * snoise(p);
            p *= 2.0;
            amplitude *= 0.5;
        }
        return value;
    }

    void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        
        // Múltiples ondas con diferentes frecuencias y velocidades
        float wave1 = sin(position.x * 0.8 + uTime * 1.2) * 0.3;
        float wave2 = sin(position.x * 1.2 - uTime * 0.8) * 0.2;
        float wave3 = sin(position.y * 0.5 + uTime * 0.6) * 0.15;
        
        // Usar fbm para textura orgánica
        float noise = fbm(vec3(position.x * 0.1, position.y * 0.1, uTime * 0.1)) * 0.4;
        
        // Combinar ondas principales con ruido
        float elevation = wave1 + wave2 + wave3 + noise;
        
        // Crear un efecto de máscara suave para que parezca una cinta flotante
        float ribbonMask = smoothstep(0.8, 0.4, abs(position.y / 10.0));
        elevation *= ribbonMask;
        
        // Aplicar la elevación
        modelPosition.z += elevation * 1.2;
        
        // Pasar variables al fragment shader
        vElevation = elevation;
        vPosition = modelPosition.xyz;
        vNormal = normal;

        gl_Position = projectionMatrix * viewMatrix * modelPosition;
    }
`;

// Fragment shader como string
export const fragmentShader = `
uniform float uTime;
varying float vElevation;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    // Colores base para la onda
    vec3 deepBlue = vec3(0.05, 0.1, 0.3);      // Azul profundo
    vec3 midBlue = vec3(0.1, 0.3, 0.6);        // Azul medio
    vec3 lightBlue = vec3(0.4, 0.7, 1.0);      // Azul claro
    vec3 white = vec3(0.8, 0.9, 1.0);          // Casi blanco
    
    // Normalizar la elevación para los colores
    float normalizedElevation = (vElevation + 1.0) * 0.5; // De [-1,1] a [0,1]
    
    // Crear gradiente de color basado en la altura
    vec3 color = deepBlue;
    color = mix(color, midBlue, smoothstep(0.1, 0.4, normalizedElevation));
    color = mix(color, lightBlue, smoothstep(0.4, 0.7, normalizedElevation));
    color = mix(color, white, smoothstep(0.7, 1.0, normalizedElevation));
    
    // Añadir un efecto de fresnel para simular reflexión
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), 2.0);
    
    // Intensificar las crestas de las ondas
    float intensity = 1.0 + fresnel * 0.5;
    color *= intensity;
    
    // Crear efecto de transparencia basado en la elevación
    float alpha = 0.6 + normalizedElevation * 0.4;
    
    // Añadir un sutil efecto de brillo animado
    float glow = sin(uTime * 2.0 + vPosition.x * 0.5) * 0.1 + 0.9;
    color *= glow;
    
    gl_FragColor = vec4(color, alpha);
}
`;