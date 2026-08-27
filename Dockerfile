FROM nginxinc/nginx-unprivileged:1.29-alpine
COPY --chown=101:101 --chmod=0644 nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --chown=101:101 dist /usr/share/nginx/html
COPY --chown=101:101 dist/documents /opt/seed-documents

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
