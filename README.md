## StreamVue 

To run the devserver:
```
npm install
npm run dev
```

To build:

```
npm install
npm run build

Copy files from dist to webserver
Configure SPA, guide below
```

Configure SPA:

Apache .htaccess file:
```
<IfModule mod_rewrite.c>
    RewriteEngine On

    # Redirect everything to index.html except files and directories
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.html [L]
</IfModule>
```

Nginx vhosts:
```
location / {
    # Serve index.html for all routes except actual files or directories
    try_files $uri /index.html;
}
```