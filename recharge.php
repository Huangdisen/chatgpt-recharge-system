<?php
// 设置响应类型
header('Content-Type: application/json');

// 获取原始 POST 数据
$input = file_get_contents('php://input');

// 初始化 CURL
$ch = curl_init('https://gpt.applecz.com/recharge');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $input);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

// 执行 CURL 请求
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// 错误处理
if (curl_errno($ch)) {
    http_response_code(500);
	$errorMessage = curl_error($ch);
	if (strpos($errorMessage, 'gpt.applecz.com') !== false) {
        $errorMessage = str_replace('gpt.applecz.com', '你的域名', $errorMessage);
    }
    echo json_encode(['error' => 'CURL Error: ' . $errorMessage]);
    curl_close($ch);
    exit;
}
curl_close($ch);

// 设置响应状态码
http_response_code($httpCode);

// 输出结果
echo $response;
