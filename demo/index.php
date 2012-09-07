<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">

        <link rel="stylesheet" href="css/bootstrap.min.css">
        <style>
            body {
                padding-top: 60px;
                padding-bottom: 40px;
            }
        </style>
        <link rel="stylesheet" href="css/bootstrap-responsive.min.css">
        <link rel="stylesheet" href="css/main.css">

        <script src="js/vendor/modernizr-2.6.1-respond-1.1.0.min.js"></script>
    </head>
    <body>
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an outdated browser. <a href="http://browsehappy.com/">Upgrade your browser today</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to better experience this site.</p>
        <![endif]-->

        <!-- This code is taken from http://twitter.github.com/bootstrap/examples/hero.html -->

        <div class="navbar navbar-inverse navbar-fixed-top">
            <div class="navbar-inner">
                <div class="container">
                    <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </a>
                    <a class="brand" href="#">Project name</a>
                    <div class="nav-collapse collapse">
                        <ul class="nav">
                            <li class="active"><a href="#">Home</a></li>
                            <li><a href="#about">About</a></li>
                            <li><a href="#contact">Contact</a></li>
                            <li class="dropdown">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown <b class="caret"></b></a>
                                <ul class="dropdown-menu">
                                    <li><a href="#">Action</a></li>
                                    <li><a href="#">Another action</a></li>
                                    <li><a href="#">Something else here</a></li>
                                    <li class="divider"></li>
                                    <li class="nav-header">Nav header</li>
                                    <li><a href="#">Separated link</a></li>
                                    <li><a href="#">One more separated link</a></li>
                                </ul>
                            </li>
                        </ul>
                        <form class="navbar-form pull-right">
                            <input class="span2" type="text" placeholder="Email">
                            <input class="span2" type="password" placeholder="Password">
                            <button type="submit" class="btn">Sign in</button>
                        </form>
                    </div><!--/.nav-collapse -->
                </div>
            </div>
        </div>

        <div class="container">



          <?php
          function filesize_format($size, $sizes = array('Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'))
          {
            if ($size == 0) return('n/a');
            return (round($size/pow(1024, ($i = floor(log($size, 1024)))), 2) . ' ' . $sizes[$i]);
          }

          // TODO, we also need full filepath/ depth.
          function getList( $path )
          {
            $aFolders = array();
            $aFiles = array();

            $it = new DirectoryIterator( $path );
            foreach($it as $dirIter)
            {
              if ($dirIter->isDot()) {
                continue;
              }

              if ($dirIter->isDir()) {
                $aFolders[$dirIter->getBasename()] = $dirIter->getPathname();
              }

              if ($dirIter->isFile())
              {
                $ext = '.' . pathinfo($dirIter->getFilename(), PATHINFO_EXTENSION);
                $aFiles[$dirIter->getBasename($ext)] = $dirIter->getFilename();
              }
            }

            $aRetVal = array();

            ksort( $aFolders );
            foreach ($aFolders as $basename => $pathname)
            {
              $aRetVal = array_merge(
                $aRetVal,
                array( $basename ),
                getList( $pathname )
              );
            }

            ksort( $aFiles );
            $aRetVal = array_merge( $aRetVal, array_values($aFiles) );

            return $aRetVal;
          }

          $path = realpath(__DIR__ . '/..');
          $aFilePaths = getList( $path );

          ?>

          <table class="table table-striped table-bordered table-hover table-condensed">

            <caption>Dateien in "<?php echo $path; ?>":</caption>

            <thead>
              <tr>
                <td></td>
                <td>Name</td>
                <td>Modified</td>
                <td>Type</td>
                <td>Size</td>
              </tr>
            </thead>

            <tbody>

              <?php foreach ($aFilePaths as $fileName): ?>
              <tr>
                <td></td>
                <td><?php echo $fileInfo->getFileName(); ?></td>
                <td><?php echo date('d.m.Y H:i', $fileInfo->getMTime()); ?></td>
                <td><?php echo $fileInfo->isDir() ? 'Dateiordner' : '.'.pathinfo($fileInfo->getFilename(), PATHINFO_EXTENSION).'-Datei'; ?></td>
                <td><?php echo $fileInfo->isDir() ? '' : filesize_format($fileInfo->getSize()); ?></td>
              </tr>
              <?php endforeach; ?>

            </tbody>

          </table>



          <hr>

          <footer>
              <p>&copy; Company 2012</p>
          </footer>

        </div> <!-- /container -->

        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.8.0.min.js"><\/script>')</script>

        <script src="js/vendor/bootstrap.min.js"></script>

        <script src="js/main.js"></script>
    </body>
</html>
