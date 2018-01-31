# opencv
if [ ! -d "opencv" ]; then
    sudo apt-get install cmake g++ gdb -y
    sudo apt-get install libavcodec-dev libavformat-dev libgtk2.0-dev libswscale-dev pkg-config -y
    git clone https://github.com/opencv/opencv
    cd opencv
    mkdir release
    cd release
    cmake -DCMAKE_BUILD_TYPE=RELEASE -DCMAKE_INSTALL_PREFIX=/usr/local ..
    make
    sudo make install
    cd ../../
else
    cd opencv/release
    sudo make install
    cd ../../
fi

# tesseract
sudo apt-get install tesseract-ocr