# opencv
if [ ! -d "opencv" ]; then
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

# subimage
git submodule update --recursive
cd src/pokeplanet/lib/subimage
mkdir build
cd build
cmake ../
make
cd ../../../../../

# tesseract
sudo apt-get install tesseract-ocr -y