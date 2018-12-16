<!DOCTYPE html>
<html lang="cs">
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <?php wp_title('|', true, 'right');?>
   <meta http-equiv="X-UA-Compatible" content="ie=edge">
   <meta name="description" content="<?php bloginfo("description")?>">
   <meta name="keywords" content="Keywords">
   <meta name="author" content="Jakub Hromek">
   <meta name="robots" content="index, follow">
   <meta property="og:title" content="<?php bloginfo("name")?>" />
   <meta property="og:description" content="<?php bloginfo("description")?>" />
   <meta property="og:site_name" content="<?php bloginfo("name")?>" />
   <meta property="og:image" content="Url to image" />
   <?php hrom_css();?>
   <?php wp_head(); ?>
   <?php require 'favicons.php'; ?>
</head>
<body class="site">
   <header id="top" class="header">
      <nav class="main-menu header-head">
         <div class="bar">
            <span class="text"><?php _e('Menu'); ?></span>
               <img alt="<?php _e('Menu'); ?>" class="menu icon" src="<?php echo get_template_directory_uri() ?>/images/svg/bar.svg">
               <img alt="<?php _e('Zavřít'); ?>" class="cancel icon" src="<?php echo get_template_directory_uri()?>/images/svg/cross.svg">
            </div>
         <div class="logo">
            <img alt="<?php bloginfo("name")?>" src="<?php echo get_template_directory_uri()?>/images/logo/logo_white.svg">
            <h1><?php bloginfo("name")?></h1>
         </div>
         <ul>
            <?php hash_nav_bar(); ?>
         </ul>
      </nav>
      <div class="header-container header-body">
         <h2><?php bloginfo("description")?></h2>
      </div>
      <div class="header-foot"></div>
   </header>