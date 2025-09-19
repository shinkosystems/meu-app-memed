/** @type {import('next').NextConfig} */
const nextConfig = {
    // Adicione aqui o pacote que precisa ser transpilado
    transpilePackages: ['uuid'],
};

module.exports = nextConfig;