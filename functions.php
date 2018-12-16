<?php
/**
 * Zakaze admin bar
 */
show_admin_bar(false);

/**
 * Registruje hlavni menu
 */
function register_header_menu()
{
    register_nav_menu('header-menu', __('Header Menu'));
}
add_action('init', 'register_header_menu');

/**
 * Vypis v pravo nahore
 */
function wp_dump($var)
{
    static $id = 0;
    echo '<div style="position: fixed;top:' . 30 * $id++ . 'px; right: 0; z-index: 9999;">';
    echo '<div onclick="(document.getElementById(\'dump_' . $id . '\').style.display == \'none\') ? document.getElementById(\'dump_' . $id . '\').style.display=\'block\' : document.getElementById(\'dump_' . $id . '\').style.display=\'none\'" style="background: #f5f5f5; float: right; width: 25px;height: 30px;padding-top: 4px;text-align: center;font-weight: bold;border: 2px solid #999;color:#999;cursor: pointer;">?</div>';
    echo '<pre style="overflow: scroll;width: 960px;height: 700px; display: none; background: white;" id="dump_' . $id . '">';
    htmlspecialchars(var_dump($var));
    echo "</pre></div>";
}

/**
 * Hash menu
 */
function hash_nav_bar()
{
    $wpb_all_query = new WP_Query(
        array(
            'post_type' => 'page',
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'orderby' => 'menu_order',
            'order' => 'ASC',
        )
    );

    if ($wpb_all_query->have_posts()) {
        while ($wpb_all_query->have_posts()) {
            $wpb_all_query->the_post();
            echo '<li id="menu-link-' . get_post_field('post_name', get_post()) . '"><a href="#' . get_post_field('post_name', get_post()) . '">' . get_the_title() . '</a></li>';
        }
    }
}

/**
 * Obsah pro hash menu
 */
function hash_content()
{
    $wpb_all_query = new WP_Query(
        array(
            'post_type' => 'page',
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'orderby' => 'menu_order',
            'order' => 'ASC',
        )
    );
    if ($wpb_all_query->have_posts()) {
        while ($wpb_all_query->have_posts()) {
            $wpb_all_query->the_post();
            $template = get_page_template();
            if ($template) {
                include $template;
            } else {
                raf_content();
            }

        }
    }
}

function raf_content()
{
    $postName = get_post_field('post_name', get_post());
    echo '<div id="page-' . $postName . '" class="article-container">';
    echo '<div id="' . $postName . '" class="anchor"></div>';
    echo '<article class="page">';
    echo '<div class="container">';
    echo '<header><h2>' . get_the_title() . '</h2></header>';
    echo '<div class="content">';
    the_content();
    //edit_post_link('Upravit', '<p class="text-right edit-link">', '</p>', the_ID());
    echo '</div>';
    echo '</div>';
    echo '</article>';
    echo '</div>';
}

/**
 * Javascripty
 */
function hrom_js()
{
    echo "<script>window.templateUrl = \"" . get_template_directory_uri() . "\";</script>";
    echo "<script src=\"" . get_template_directory_uri() . "/js/dist/all.min.js\"></script>";
}

/**
 * CSS / SASS
 */
function hrom_css()
{
    echo "<link rel=\"stylesheet\" href=\"" . get_bloginfo('stylesheet_url') . "\" />";
}

/**
 * Print up button
 */
function hrom_up_button() {
    echo "<a href=\"#top\" class=\"up-button\">";
    echo "<img alt=\"Nahoru\" src=\"". get_template_directory_uri() . "/images/svg/arrow-up.svg\" />";
    echo "</a>";
}

/**
 * Print social buttons
 */
function hrom_socials() {
    $socials = array(
        'facebook' => array(
            'alt' => 'FaceBook',
            'url' => 'https://www.facebook.com/',
            'img' => get_template_directory_uri() . "/images/svg/facebook-square.svg"
        ),
        'instagram' => array(
            'alt' => 'Instagram',
            'url' => 'https://www.instagram.com/',
            'img' => get_template_directory_uri() . "/images/svg/instagram.svg"
        ),
    );

    echo "<div class=\"socials\">";
    foreach ($socials as $key => $value) {
        echo "<a target=\"_blank\" href=\"" . $value['url'] . "\">";
            echo "<img src=\"" . $value['img'] . "\" alt=\"" . $value['alt'] . "\" />";
        echo "</a>";
    }
    echo "</div>";
}

/**
 * Vychoti uzivatelska pole
 */
function default_custom_fields($post_id)
{
    if ($_GET['post_type'] != 'page') {
        add_post_meta($post_id, 'background-color', '', true);
        add_post_meta($post_id, 'text-color', '', true);
        add_post_meta($post_id, 'show-header', 'false', true);
    }
    return true;
}

add_action('wp_insert_post', 'default_custom_fields');
