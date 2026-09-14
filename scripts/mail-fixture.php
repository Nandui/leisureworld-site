<?php
// CLI fixture: PHP's real mail() MUST be disabled; this never sends email.
if (PHP_SAPI !== 'cli' || !in_array('mail', explode(',', ini_get('disable_functions')), true)) {
    http_response_code(404);
    exit;
}
$fixture = json_decode(stream_get_contents(STDIN), true, 512, JSON_THROW_ON_ERROR);
$_POST = $fixture['post'] ?? [];
$_SERVER = array_merge(['REQUEST_METHOD'=>'POST', 'HTTP_ACCEPT'=>'application/json'], $fixture['server'] ?? []);
putenv('LEISUREWORLD_CONTACT_TO=' . ($fixture['recipient'] ?? 'qa@example.invalid'));
$mailCalls = [];
if (!function_exists('mail')) {
    function mail($to, $subject, $body, $headers): bool {
        global $mailCalls, $fixture;
        $mailCalls[] = ['to'=>$to, 'subject'=>$subject, 'headers'=>$headers];
        return $fixture['mail_success'] ?? true;
    }
}
ob_start();
register_shutdown_function(function() {
    global $mailCalls;
    $body=ob_get_clean();
    echo json_encode(['status'=>http_response_code(),'body'=>$body,'mail_calls'=>$mailCalls]);
});
require dirname(__DIR__) . '/send-mail.php';
