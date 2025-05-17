<?php

namespace App\Helpers;

use Illuminate\Support\Str;

class BreadcrumbHelper
{
    public static function generate(string $path)
    {
        $segments = explode('/', trim($path, '/'));
        $breadcrumbs = [];
        $url = '';

        foreach ($segments as $segment) {
            $url .= '/' . $segment;
            $breadcrumbs[] = [
                'label' => Str::title(str_replace('-', ' ', $segment)),
                'url' => $segment === end($segments) ? null : $url, // no link on last
            ];
        }

        return $breadcrumbs;
    }
}
