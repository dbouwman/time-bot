db.timers.aggregate(
    {
        "$match": {
            "user": "dbouwman"
        }
    },
    { 
        "$group": { 
            _id: { user: "$user", day: { $dayOfMonth: "$recordedOn" } },
            totalTime: {$sum: "$duration" },
            entries: { $sum: 1} 
        }
        
    },{
        "$project": {
            "_id":0,
            "user": "$_id.user",
            "day": "$id.day",
            "totalTime" : 1,
            "entries": 1
        }
    });