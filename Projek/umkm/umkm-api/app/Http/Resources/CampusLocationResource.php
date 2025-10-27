<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

// App/Http/Resources/CampusLocationResource.php
class CampusLocationResource extends JsonResource {
    public function toArray($request) {
        return ['id' => $this->id, 'name' => $this->name];
    }
}