# ---------- Stage 1: build ----------
FROM node:18-alpine AS build
WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci --include=dev || npm install --include=dev
RUN npm install -D sass eslint-plugin-react-hooks

COPY . .
# Skip CRA’s ESLint plugin in CI builds (prevents lint rule lookup errors)
ENV CI=true
ENV DISABLE_ESLINT_PLUGIN=true
RUN npm run build

# ---------- Stage 2: serve with Nginx ----------
FROM nginx:1.25-alpine

# Write SPA-friendly Nginx config directly (no external nginx.conf needed)
RUN printf '%s\n' \
  'server {' \
  '  listen 80;' \
  '  server_name _;' \
  '  root /usr/share/nginx/html;' \
  '  index index.html;' \
  '  location ~* \.(?:js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|gif)$ {' \
  '    expires 1y;' \
  '    add_header Cache-Control "public, immutable";' \
  '    try_files $uri =404;' \
  '  }' \
  '  location / {' \
  '    try_files $uri /index.html;' \
  '  }' \
  '}' > /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
