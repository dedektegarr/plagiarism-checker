<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class GroupController extends Controller
{
    public function index()
    {
        return Inertia::render("group/document-group");
    }

    public function destroy(Group $group)
    {
        $documents = $group->documents;

        foreach ($documents as $document) {
            Storage::delete($document->path);
        }

        $group->delete();
    }
}
