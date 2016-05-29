# lca2016-digital-signage

## Overview

The ZooKeepr conference management system (http://zookeepr.org/) provides a JSON feed of the conference Schedule. This is great as a web page, and passable on a mobile device. However, the conference often wants to display the Schedule in various ways, such as in between talks and on digital signage.

This package is a minimum viable product (MVP) to solve this problem.

## How to use

The file [index.html](index.html) takes the following parameters as GET variables. The URL structure is demonstrated in [all-links.html](all-links.html).

* room: The URI-encoded string value matching a value for the "Room Name" key in the JSON file.
* displayType: takes a string value of [room|current]. A value of room will show the schedule for the room. A value of current will show upcoming presentations in each room

The variables you will have to set up to re-use this are;

* Defining the dates of the conference in [schedule-signage.js](js/schedule-signage.js)
* The location of the JSON file - can be local or remote

## To do

* Ideally the dependencies should be packaged using Bower, Grunt etc.
* The setup and the actual processing of the JSON Schedule feed should be separated so that the conference Organising Team only has to touch one file - the setup file
* The HTML itself isn't overly responsive and this could be improved
* Same for WCAG and HTML and W3C CSS Jigsaw compliance
