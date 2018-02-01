#!/bin/bash

dir=`pwd`

#
# opencv
#
sudo apt-get install libavcodec-dev libavformat-dev libgtk2.0-dev libswscale-dev -y
if [ ! -f "opencv/README.md" ]; then
    git clone https://github.com/opencv/opencv
    cd opencv
    mkdir release
    cd release
    cmake -DCMAKE_BUILD_TYPE=RELEASE -DCMAKE_INSTALL_PREFIX=/usr/local ..
    make
else
    cd opencv/release
fi
sudo make install
cd $dir

#
# subimage
#
git submodule update --recursive
cd src/pokeplanet/lib/subimage
mkdir build
cd build
cmake ../
make
cd $dir

#
# tesseract
#
sudo apt-get install autoconf-archive automake libtool -y
if [ ! -f "leptonica/README.md" ]; then git clone https://github.com/DanBloomberg/leptonica.git; fi
cd leptonica
mkdir build
cd build
cmake ../
cmake --build .
cd $dir
if [ ! -f "tesseract/README.md" ]; then git clone https://github.com/tesseract-ocr/tesseract; fi
cd tesseract
./autogen.sh
./configure
make
sudo make install
sudo ldconfig
cd $dir