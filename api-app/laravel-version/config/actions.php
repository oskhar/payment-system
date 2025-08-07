<?php

return [
    /*
     * |--------------------------------------------------------------------------
     * | Actions Paths
     * |--------------------------------------------------------------------------
     * |
     * | This value is the list of paths where your actions are located.
     * | You should put inside all the paths where you want to have your
     * | actions discovered. All paths are relative to your base path.
     * |
     */
    'paths' => [
        app_path(''),
    ],

    /*
     * |--------------------------------------------------------------------------
     * | Actions Base Class
     * |--------------------------------------------------------------------------
     * |
     * | This value is the base class that all your actions should extend.
     * | You can change this value to your own base class if you want to
     * | extend all your actions from a single class of your own.
     * |
     */
    'base_class' => Lorisleiva\Actions\Concerns\AsAction::class,
];
