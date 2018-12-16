   <footer class="footer">
      <?php hrom_socials(); ?>
      <p><a href="http://www.hromek.info">Jakub Hromek</a> &copy; <?=Date("Y")?></p>
      <p><?php _e('Icons made by'); ?> <a href="https://fontawesome.com">fontawesome.com</a></p>
   </footer>
   <?php
      wp_footer();
      hrom_js();
      //hrom_up_button();
   ?>
</body>
</html>