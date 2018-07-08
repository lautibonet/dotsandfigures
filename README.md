# Dots and figures

Simple html/JavaScript program that interacts with the user and draws some geometrical shapes.
The program is launched by viewing “index.html”.

No external library required.

### Basic flow
The user selects three arbitrary points within the client area of the browser. As they are
selected, the program highlights their location by drawing red circles centered on each selected point.
Based on these three points, two additional shapes are drawn:
- a blue parallelogram, having three of its corners in the points selected by the user.
- a yellow circle, with the same area and centre of mass as the parallelogram.

The coordinates of the selected points as well as the area of the parallelogram and circle
are presented to the user.
The user is free to move around the points. This makes the parallelogram, circle and printed
information update accordingly.

There is also a “reset” feature that clears the board and lets the user select three new points,
repeating the process described above.

Finally, there is an “about” feature that presents information about the program and how it works.
