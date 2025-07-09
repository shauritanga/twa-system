<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PenaltyCalculationReport extends Mailable
{
    use Queueable, SerializesModels;

    public array $results;

    /**
     * Create a new message instance.
     */
    public function __construct(array $results)
    {
        $this->results = $results;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Monthly Penalty Calculation Report - ' . now()->format('F Y'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.penalty-calculation-report',
            with: [
                'results' => $this->results,
                'calculationDate' => now()->format('F j, Y'),
                'hasErrors' => !empty($this->results['errors']),
                'hasPenalties' => $this->results['penalties_created'] > 0,
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
