mongosh -- "$MONGO_INITDB_DATABASE" <<EOF
    let rootUser = '$MONGO_ROOT_USERNAME'
    let rootPass = '$MONGO_ROOT_PASSWORD'
    let admin = db.getSiblingDB('admin')
    admin.auth(rootUser, rootPass)
    let user = '$MONGO_USERNAME'
    let pwd = '$MONGO_PASS'
    db.createUser({
        user,
        pwd,
        roles: ['readWrite']
    })
EOF