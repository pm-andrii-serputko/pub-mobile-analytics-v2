PubMatic Analytics UI
=========
Follow 7 steps below to build a PubMatic Analytics UI environment.

<h1>Environment Setup:<br/></h1>
1.) Download & Install <a href="http://nodejs.org/">node.js</a>
<br/>2.) Install Grunt and Bower CLI at command line: npm install -g grunt-cli bower
<br/>3.) In mac terminal type: git clone https://github.com/PubMatic/pubSlicer.git
<br/>4.) cd pubSlicer
<br/>5.) npm install
<br/>6.) grunt shell
<br/>7.) bower install
<br/>8.) grunt serve
<br/><br/>Your local testing environment will open in a browser window at http://localhost:9000

<h4>Note:</h4>  Make sure that your gem list does not contain rubygems-update by typing the following command:<br/>
<b>gem list</b> <br/><br/>

If you see rubygems-update in the gem list, you should uninstall it by using the following command: <br/>
<b>sudo gem uninstall rubygems-update</b> <br/><br/>
Also the list of gems should look like the following and have the exact same versions when you type <b>"gem list"</b> command, else the styles on your application might end up being broken:<br/><br/>
<b>bigdecimal (1.2.4)</b><br/>
<b>breakpoint (2.5.0)</b><br/>
<b>bundler (1.8.5)</b><br/>
<b>chunky_png (1.3.1)</b><br/>
<b>compass (1.0.1)</b><br/>
<b>compass-core (1.0.1)</b><br/>
<b>compass-import-once (1.0.5)</b><br/>
<b>ffi (1.9.3)</b><br/>
<b>io-console (0.4.2)</b><br/>
<b>json (1.8.1)</b><br/>
<b>minitest (4.7.5)</b><br/>
<b>multi_json (1.10.1)</b><br/>
<b>psych (2.0.5)</b><br/>
<b>rake (10.1.0)</b><br/>
<b>rb-fsevent (0.9.4)</b><br/>
<b>rb-inotify (0.9.5)</b><br/>
<b>rdoc (4.1.0)</b><br/>
<b>rvm (1.11.3.9)</b><br/>
<b>sass (3.3.14)</b><br/>
<b>sassy-maps (0.4.0)</b><br/>
<b>susy (2.1.3)</b><br/>
<b>test-unit (2.1.2.0)</b><br/>


<h1>How it's Built</h1>
This diagram outlines build components of the pubSlicer development environment:<br/><br/>
<img src='arch.png'></img>

<h1>Starting your local environment</h1>
Builds are managed using <a href='http://gruntjs.com/'>Grunt build tool</a>. To use grunt, navigate to root pubSlicer folder and use any of these commands:
<table>
<tr><td>grunt serve</td>   <td>  Start Your environment in debug mode at url: http://localhost:9000    </td></tr>
<tr><td>grunt jshint</td>  <td>  Check your code style against PubMatic coding standards</td></tr>
<tr><td>grunt test</td>    <td>  Verify your application is ready to deploy.  Run the automated unit testing suite.</td></tr>
<tr><td> grunt </td> <td> Production build deployed to "dist" folder. "dist" is deployed via CI/Jenkins. </td></tr>
</table>

<!--Style guide located <a href='https://inside.pubmatic.com:8443/confluence/display/Products/Javascript+and+AngularJS+Coding+Standards'>on wiki</a>.  -->

<h1>Design and Styling</h1>
Slicer UI uses a PubMatic designed UX Component library called <a href="https://github.com/PubMatic/tophat">TopHat</a> (installed via bower)

