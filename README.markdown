[![Build Status](https://secure.travis-ci.org/palominolabs/betterment2qif.png)](http://travis-ci.org/palominolabs/betterment2qif)


Generating a key for signing Chrome extensions
----------------------------------------------
```openssl genrsa 1024 > chrome_private_key.pem```

Running tests
-------------
Run the ruby tests with ```bundle exec rspec``` Or with autotest: ```bundle exec autotest```

Run the JS tests with ```bundle exec jasmine``` And then visit http://localhost:8888

Run all the tests with ```rake```
