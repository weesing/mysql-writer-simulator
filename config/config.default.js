module.exports = {
    "mysql": {
        "host": "192.168.160.113",
        "port": "3306",
        "database": "weesingdb"
    },
    "settings": {
        "models": {
            "default": {
                "SchemaA": {
                    "createFrequency": 3,
                    "readFrequency": 1
                },
                "SchemaB": {
                    "createFrequency": 10,
                    "readFrequency": 0
                }
            }
        }
    }
};