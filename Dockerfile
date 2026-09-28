# Sử dụng Image Node.js chính thức
FROM node:20-alpine

# Tạo thư mục làm việc bên trong container
WORKDIR /app

# Sao chép package.json và package-lock.json vào
COPY package*.json ./

# Cài đặt các package production
RUN npm install --production

# Sao chép toàn bộ mã nguồn còn lại vào container
COPY . .

# Khai báo cổng mà ứng dụng sẽ chạy
EXPOSE 3000

# Lệnh khởi động ứng dụng
CMD ["node", "server.js"]
