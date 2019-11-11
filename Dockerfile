FROM hub.sunmi.com/wifi/frontend-base:latest
COPY nginx.conf /etc/nginx/nginx.conf

COPY ./docker/timezone /etc/
COPY ./docker/localtime /etc/

COPY . /app/src
RUN npm cache clean --force
RUN cd /app/src && npm install
RUN cd /app/src && npm run build:test && ls && cp -r /app/src/dist/ /app/80
RUN rm -r /app/src

EXPOSE 7777
RUN chown -R nginx:nginx /app/80
