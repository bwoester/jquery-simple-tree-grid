<?php
function getFileType( SplFileInfo $fi )
{
  $ext = pathinfo( $fi->getFilename(), PATHINFO_EXTENSION );
  return $fi->isDir()
    ? 'Dateiordner'
    : ($ext === '' ? 'Datei' : ".{$ext}-Datei");
}

function getFileSize( SplFileInfo $fi )
{
  return $fi->isDir()
    ? ''
    : filesize_format( $fi->getSize() );
}

function getFileMTime( SplFileInfo $fi )
{
  return date( 'd.m.Y H:i', $fi->getMTime() );
}

function createRootLink( SplFileInfo $fi, $root )
{
  $fiRoot = new SplFileInfo( $root );
  $aRootSegments = explode( DIRECTORY_SEPARATOR, $fiRoot->getRealPath() );
  $aSegments = explode( DIRECTORY_SEPARATOR, $fi->getRealPath() );

  $strRootPath = implode('/', $aRootSegments);
  $strFilePath = implode('/', $aSegments);

  return '?root='.substr($strFilePath, strlen($strRootPath)+1);
}

function createParentLink( $requestedPath, $ROOT_PATH )
{
  $fi = new SplFileInfo( $requestedPath );
  return createRootLink( new SplFileInfo($fi->getPath()), $ROOT_PATH );
}

function getFileDepth( SplFileInfo $fi, $root )
{
  $fiRoot = new SplFileInfo( $root );
  $aRootSegments = explode( DIRECTORY_SEPARATOR, $fiRoot->getRealPath() );
  $aSegments = explode( DIRECTORY_SEPARATOR, $fi->getRealPath() );
  return count($aSegments) - count($aRootSegments) - 1;
}

function filesize_format($size, $sizes = array('Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'))
{
  if ($size == 0) return('n/a');
  return (round($size/pow(1024, ($i = floor(log($size, 1024)))), 2) . ' ' . $sizes[$i]);
}

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
      $aFolders[$dirIter->getBasename()] = $dirIter->getFileInfo();
    }

    if ($dirIter->isFile())
    {
      $ext = '.' . pathinfo($dirIter->getFilename(), PATHINFO_EXTENSION);
      $aFiles[$dirIter->getBasename($ext)] = $dirIter->getFileInfo();
    }
  }

  $aRetVal = array();

  ksort( $aFolders );
  foreach ($aFolders as $fileInfo)
  {
    $aRetVal = array_merge(
      $aRetVal,
      array( $fileInfo ),
      getList( $fileInfo->getPathname() )
    );
  }

  ksort( $aFiles );
  $aRetVal = array_merge( $aRetVal, array_values($aFiles) );

  return $aRetVal;
}


$ROOT_PATH = realpath( __DIR__ );

$requestedPath = $ROOT_PATH;
if (isset($_GET['root']) && strpos($_GET['root'],'..') === false && !empty($_GET['root']) && file_exists("{$ROOT_PATH}/{$_GET['root']}"))
{
  $requestedPath = "{$ROOT_PATH}/{$_GET['root']}";
}

$aFileInfo = getList( $requestedPath );

?><!DOCTYPE html>
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

            tr.depth-1 > td:first-child {
              padding-left: 15px;
            }
            tr.depth-2 > td:first-child {
              padding-left: 25px;
            }
            tr.depth-3 > td:first-child {
              padding-left: 35px;
            }
            tr.depth-4 > td:first-child {
              padding-left: 45px;
            }
            tr.depth-5 > td:first-child {
              padding-left: 55px;
            }
            tr.depth-6 > td:first-child {
              padding-left: 65px;
            }
            tr.depth-7 > td:first-child {
              padding-left: 75px;
            }
            tr.depth-8 > td:first-child {
              padding-left: 85px;
            }
            tr.depth-9 > td:first-child {
              padding-left: 95px;
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


          <div class="row">
            <div class="span12">
              <h2>HTML based hierarchical grid data</h2>
              <p>
                How would you display hierarchical grid data if there was no
                JavaScript available? I can think of two ways:
              </p>
            </div>
          </div>

          <div class="row">
            <div class="span12">
              <h3>Collapsed, with links to navigate</h3>
              <p>
                This method is good for large trees, or for graphs. At any
                time, you represent only one level to the user. He can then
                navigate to other levels by following hyperlinks.
              </p>
              <p>
                With this method, there are no limitations rearding depth.
                There is no need for css markup.
              </p>
            </div>
          </div>

          <table class="table table-striped table-bordered table-hover table-condensed">

            <caption>Files in "<?php echo $requestedPath; ?>" (collapsed, no js):</caption>

            <thead>
              <tr>
                <td>Name</td>
                <td>Modified</td>
                <td>Type</td>
                <td>Size</td>
              </tr>
            </thead>

            <tbody>

              <?php if ($requestedPath !== $ROOT_PATH): ?>
              <tr>
                <td>
                  <a <?php echo 'href="'.  createParentLink($requestedPath,$ROOT_PATH).'"' ?>>
                    ..
                  </a>
                </td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <?php endif; ?>

              <?php/* @var $fileInfo SplFileInfo */ ?>
              <?php foreach ($aFileInfo as $fileInfo): ?>
              <?php $depth = getFileDepth($fileInfo,$requestedPath); ?>
              <?php if ($depth > 0) continue; ?>
              <tr>
                <td>
                  <?php if ($fileInfo->isDir()): ?>
                  <a <?php echo 'href="'.  createRootLink($fileInfo,$ROOT_PATH).'"' ?>>
                    <?php echo $fileInfo->getFileName(); ?>
                  </a>
                  <?php else: ?>
                  <?php echo $fileInfo->getFileName(); ?>
                  <?php endif; ?>
                </td>
                <td><?php echo getFileMTime($fileInfo); ?></td>
                <td><?php echo getFileType($fileInfo); ?></td>
                <td><?php echo getFileSize($fileInfo); ?></td>
              </tr>
              <?php endforeach; ?>

            </tbody>

          </table>



          <div class="row">
            <div class="span12">
              <h3>Fully expanded</h3>
              <p>
                This method is good for smaller trees. You can give the user a
                quick overview of the whole tree content. There is no need for
                navigational logic, but you will have to find a way to
                visualize the parent/ child relationships between the the rows.
                The method below adds css classes to the rows, that describe
                the depth of each row in the tree. Each css class has a
                different margin-left value, which causes the tree-like look.
                With this method, the maximum depth of the tree you can display
                is bound to the number of css classes you define.
              </p>
            </div>
          </div>

          <table class="table table-striped table-bordered table-hover table-condensed">

            <caption>Files in "<?php echo $requestedPath; ?>" (fully expanded, no js):</caption>

            <thead>
              <tr>
                <td>Name</td>
                <td>Modified</td>
                <td>Type</td>
                <td>Size</td>
              </tr>
            </thead>

            <tbody>

              <?php/* @var $fileInfo SplFileInfo */ ?>
              <?php foreach ($aFileInfo as $fileInfo): ?>
              <?php $depth = getFileDepth($fileInfo,$ROOT_PATH); ?>
              <tr class="<?php echo "depth-$depth"; ?>">
                <td><?php echo $fileInfo->getFileName(); ?></td>
                <td><?php echo getFileMTime($fileInfo); ?></td>
                <td><?php echo getFileType($fileInfo); ?></td>
                <td><?php echo getFileSize($fileInfo); ?></td>
              </tr>
              <?php endforeach; ?>

            </tbody>

          </table>


          <div class="row">
            <div class="span12">
              <h2>JavaScript on top</h2>
              <p>
                A JavaScript solution should build on top of this, provide a
                better experience for users with js enabled. It shouldn't
                require any extra markup. Where needed, we'll pass additional
                information to the jQuery plugin. I think this is cleaner than
                attaching it to html, from where the plugin would then read it
                back.
              </p>
            </div>
          </div>

          <table id="example-1" class="table table-striped table-bordered table-hover table-condensed">

            <caption>Files in "<?php echo $requestedPath; ?>" (js, from fully expanded):</caption>

            <thead>
              <tr>
                <td>Name</td>
                <td>Modified</td>
                <td>Type</td>
                <td>Size</td>
              </tr>
            </thead>

            <tbody>

              <?php
              $aDepth = array();
              /* @var $fileInfo SplFileInfo */
              foreach ($aFileInfo as $fileInfo):
                $depth = getFileDepth($fileInfo,$ROOT_PATH);
                $aDepth[] = $depth;
              ?>
              <tr class="<?php echo "depth-$depth"; ?>">
                <td><?php echo $fileInfo->getFileName(); ?></td>
                <td><?php echo getFileMTime($fileInfo); ?></td>
                <td><?php echo getFileType($fileInfo); ?></td>
                <td><?php echo getFileSize($fileInfo); ?></td>
              </tr>
              <?php endforeach; ?>

            </tbody>

          </table>

          <script>
            var bwoester = bwoester || {};
            bwoester.example_1 = bwoester.example_1 || {};
            bwoester.example_1.columns = [ 'name', 'mtime', 'type', 'size' ];
            bwoester.example_1.depthList = <?php echo json_encode($aDepth) ?>;
          </script>

          <!-- see main.js for plugin invocation -->

          <hr>

          <footer>
              <p>&copy; Company 2012</p>
          </footer>

        </div> <!-- /container -->

        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.8.0.min.js"><\/script>')</script>

        <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-ui-1.8.23.min.js"><\/script>')</script>

        <script src="js/vendor/bootstrap.min.js"></script>

        <script src="../src/closure-library/closure/goog/base.js"></script>
        <script src="../src/simple-tree-grid/deps.js"></script>
        <script src="../src/simple-tree-grid/jquery.simpleTreeGrid.js"></script>

        <script src="js/main.js"></script>
    </body>
</html>
