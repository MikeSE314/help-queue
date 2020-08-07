# ubiquitous-barnacle
Help list

## Environment keys:
```
PORT
PRIMARY
SECONDARY
ADMIN_SECRET
```

The `PORT` is the port you will be listening on. Default is `8000`.

The `PRIMARY` and `SECONDARY` are for selecting styles. If none is specified, one will be chosen at program startup.

The `ADMIN_SECRET` is the secret an admin should use to give them permissions to remove students from lists.

## Starting the project

Run `node bin/www`. NodeJS should then tell you the port and admin passphrase.