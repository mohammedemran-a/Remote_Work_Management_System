<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout'],

    'allowed_methods' => ['*'],


    // 👇 ضع هنا عنوان تطبيقك React أو Flutter Web


   'allowed_origins' => ['http://localhost:8000', 'http://localhost:3000', 'http://localhost:8000'],

    'allowed_origins_patterns' => ['http://localhost:8000'],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
