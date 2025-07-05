<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Dependent;
use App\Models\Member;

class DependentRejectionMail extends Mailable
{
    use Queueable, SerializesModels;

    public $dependent;
    public $member;

    /**
     * Create a new message instance.
     *
     * @param Dependent $dependent
     * @param Member $member
     */
    public function __construct(Dependent $dependent, Member $member)
    {
        $this->dependent = $dependent;
        $this->member = $member;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Dependent Rejection Notification')
                    ->view('emails.dependent_rejection');
    }
}
