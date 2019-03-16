module.exports = {
    "http": {
        "port": {
            "env": "PORT",
            "default": "11999"
        }
    },
    "mysql": {
        "host": {
            "env": "MYSQL_HOST",
            "default": "127.0.0.1"
        },
        "port": {
            "env": "MYSQL_PORT",
            "default": "1234"
        },
        "database": {
            "env": "DATABASE_NAME",
            "default": "Test_Database"
        },
        "username": {
            "env": "DATABASE_USERNAME",
            "default": ""
        },
        "password": {
            "env": "DATABASE_PASSWORD",
            "default": ""
        }
    },
    "settings": {
        "models": {
            "default": {
                //No schemas
                "SampleSchema": {
                    "createFrequency": 3,
                    "readFrequency": 1
                }
            }
        }
    }
};