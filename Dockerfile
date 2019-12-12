FROM node:12-slim

# Built by deploy-node-app

WORKDIR /app

ENV NODE_ENV="production"
ENV GRPC_HEALTH_PROBE_VERSION="v0.3.1"

# Add common build deps
RUN apt-get update && apt-get install -yqq nginx && \
  sed -i 's/root \/var\/www\/html/root \/app\/build/' /etc/nginx/sites-enabled/default && \
  chown -R node /app /home/node /etc/nginx /var/log/nginx /var/lib/nginx /usr/share/nginx && \
  rm -rf /var/lib/apt/lists/*

USER root

COPY package.json yarn.loc[k] package-lock.jso[n] /app/

RUN npm install --production --no-cache --no-audit

RUN GRPC_HEALTH_PROBE_VERSION=v0.3.1 && \
    wget -qO/bin/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/${GRPC_HEALTH_PROBE_VERSION}/grpc_health_probe-linux-amd64 && \
    chmod +x /bin/grpc_health_probe

COPY . /app/

CMD ["node", "dist/main.js"]
