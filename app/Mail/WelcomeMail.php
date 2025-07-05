<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class WelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $defaultPassword;

    /**
     * Create a new message instance.
     *
     * @param User $user
     * @param string $defaultPassword
     */
    public function __construct(User $user, string $defaultPassword)
    {
        $this->user = $user;
        $this->defaultPassword = $defaultPassword;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Welcome to Our System')
                    ->view('emails.welcome')
                    ->with([
                        'userName' => $this->user->name,
                        'userEmail' => $this->user->email,
                        'defaultPassword' => $this->defaultPassword,
                    ]);
    }
}
