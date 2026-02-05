<?php
if ( ! defined( "ABSPATH" ) ) {
  exit;
}

function bootblocks_setup() {
  add_theme_support( "title-tag" );
  add_theme_support( "wp-block-styles" );
  add_theme_support( "editor-styles" );
}
add_action( "after_setup_theme", "bootblocks_setup" );

function bootblocks_assets() {
  wp_enqueue_style(
    "bootblocks-bootstrap",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
    array(),
    "5.3.3"
  );

  wp_enqueue_style(
    "bootblocks-style",
    get_stylesheet_uri(),
    array( "bootblocks-bootstrap" ),
    filemtime( get_stylesheet_directory() . "/style.css" )
  );

  wp_enqueue_script(
    "bootblocks-bootstrap",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
    array(),
    "5.3.3",
    true
  );
}
add_action( "wp_enqueue_scripts", "bootblocks_assets" );

function bootblocks_editor_assets() {
  wp_enqueue_style(
    "bootblocks-bootstrap-editor",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
    array(),
    "5.3.3"
  );

  $editor_css = get_template_directory() . "/assets/css/editor.css";
  $editor_ver = file_exists( $editor_css ) ? filemtime( $editor_css ) : "1.0.0";

  wp_enqueue_style(
    "bootblocks-editor",
    get_template_directory_uri() . "/assets/css/editor.css",
    array( "bootblocks-bootstrap-editor" ),
    $editor_ver
  );

  $blocks_js = get_template_directory() . "/assets/js/blocks.js";
  $blocks_ver = file_exists( $blocks_js ) ? filemtime( $blocks_js ) : "1.0.0";

  if ( file_exists( $blocks_js ) ) {
    wp_enqueue_script(
      "bootblocks-blocks",
      get_template_directory_uri() . "/assets/js/blocks.js",
      array( "wp-blocks", "wp-element", "wp-i18n", "wp-block-editor", "wp-components", "wp-compose" ),
      $blocks_ver,
      true
    );
  }
}
add_action( "enqueue_block_editor_assets", "bootblocks_editor_assets" );

function bootblocks_block_category( $categories, $post ) {
  $category = array(
    "slug"  => "bootblocks",
    "title" => __( "BootBlocks", "bootblocks" ),
    "icon"  => null,
  );

  array_unshift( $categories, $category );
  return $categories;
}
add_filter( "block_categories_all", "bootblocks_block_category", 10, 2 );

function bootblocks_render_carousel( $attributes ) {
  $unique_id = isset( $attributes["uniqueId"] ) ? $attributes["uniqueId"] : "";
  $interval = isset( $attributes["interval"] ) ? intval( $attributes["interval"] ) : 5000;
  $height = isset( $attributes["height"] ) ? intval( $attributes["height"] ) : 500;
  $slides = isset( $attributes["slides"] ) && is_array( $attributes["slides"] ) ? $attributes["slides"] : array();

  if ( empty( $slides ) ) {
    $slides = array(
      array( "imageUrl" => "", "imageAlt" => "", "heading" => __( "Slide title", "bootblocks" ), "text" => __( "Slide copy goes here.", "bootblocks" ) ),
      array( "imageUrl" => "", "imageAlt" => "", "heading" => __( "Slide title", "bootblocks" ), "text" => __( "Slide copy goes here.", "bootblocks" ) ),
      array( "imageUrl" => "", "imageAlt" => "", "heading" => __( "Slide title", "bootblocks" ), "text" => __( "Slide copy goes here.", "bootblocks" ) ),
    );
  }

  $carousel_id = $unique_id ? $unique_id : wp_unique_id( "carousel-" );
  $style_attr = "--bootblocks-carousel-height:" . max( 300, $height ) . "px";

  $output  = '<section class="wp-block-bootblocks-carousel bootblocks-carousel carousel slide" id="' . esc_attr( $carousel_id ) . '" data-bs-ride="carousel" data-bs-interval="' . esc_attr( $interval ) . '" style="' . esc_attr( $style_attr ) . '">';
  $output .= '<div class="carousel-indicators">';
  foreach ( $slides as $index => $slide ) {
    $output .= '<button type="button" data-bs-target="#' . esc_attr( $carousel_id ) . '" data-bs-slide-to="' . esc_attr( $index ) . '" class="' . ( 0 === $index ? 'active' : '' ) . '" aria-current="' . ( 0 === $index ? 'true' : 'false' ) . '" aria-label="Slide ' . esc_attr( $index + 1 ) . '"></button>';
  }
  $output .= '</div><div class="carousel-inner">';

  foreach ( $slides as $index => $slide ) {
    $image_url = isset( $slide["imageUrl"] ) ? $slide["imageUrl"] : "";
    $image_alt = isset( $slide["imageAlt"] ) ? $slide["imageAlt"] : "";
    $heading = isset( $slide["heading"] ) ? $slide["heading"] : "";
    $text = isset( $slide["text"] ) ? $slide["text"] : "";

    $output .= '<div class="carousel-item' . ( 0 === $index ? ' active' : '' ) . '">';
    if ( $image_url ) {
      $output .= '<img class="d-block w-100" src="' . esc_url( $image_url ) . '" alt="' . esc_attr( $image_alt ) . '">';
    } else {
      $output .= '<div class="d-block w-100 bg-secondary" style="height: var(--bootblocks-carousel-height, 500px);"></div>';
    }
    if ( $heading || $text ) {
      $output .= '<div class="carousel-caption d-none d-md-block">';
      if ( $heading ) {
        $output .= '<h5>' . wp_kses_post( $heading ) . '</h5>';
      }
      if ( $text ) {
        $output .= '<p>' . wp_kses_post( $text ) . '</p>';
      }
      $output .= '</div>';
    }
    $output .= '</div>';
  }

  $output .= '</div>';
  $output .= '<button class="carousel-control-prev" type="button" data-bs-target="#' . esc_attr( $carousel_id ) . '" data-bs-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">' . esc_html__( "Previous", "bootblocks" ) . '</span></button>';
  $output .= '<button class="carousel-control-next" type="button" data-bs-target="#' . esc_attr( $carousel_id ) . '" data-bs-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">' . esc_html__( "Next", "bootblocks" ) . '</span></button>';
  $output .= '</section>';

  return $output;
}

function bootblocks_register_blocks() {
  register_block_type(
    "bootblocks/carousel",
    array(
      "render_callback" => "bootblocks_render_carousel",
      "attributes"      => array(
        "uniqueId" => array( "type" => "string", "default" => "" ),
        "interval" => array( "type" => "number", "default" => 5000 ),
        "height"   => array( "type" => "number", "default" => 500 ),
        "slides"   => array( "type" => "array", "default" => array() ),
      ),
    )
  );
}
add_action( "init", "bootblocks_register_blocks" );
