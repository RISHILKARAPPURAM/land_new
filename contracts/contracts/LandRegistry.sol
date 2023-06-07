// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract LandRegistry {
    struct Property {
        string name;
        string location;
        uint256 price;
        address owner;
    }

    struct Landmark {
        string name;
        string location;
        string description;
    }

    mapping(uint256 => Property) public properties;
    mapping(uint256 => Landmark) public landmarks;
    uint256 public totalProperties;
    uint256 public totalLandmarks;

    event PropertyAdded(uint256 indexed propertyId, string name, string location, uint256 price, address owner);
    event PropertyTransferred(uint256 indexed propertyId, address oldOwner, address newOwner);
    event LandmarkAdded(uint256 indexed landmarkId, string name, string location, string description);

    function addProperty(string memory _name, string memory _location, uint256 _price, address _owner) external {
        uint256 propertyId = totalProperties;
        properties[propertyId] = Property(_name, _location, _price, _owner);
        totalProperties++;

        emit PropertyAdded(propertyId, _name, _location, _price, _owner);
    }

    function transferProperty(uint256 _propertyId, address _newOwner) external {
        require(_propertyId < totalProperties, "Invalid property ID");

        Property storage property = properties[_propertyId];
        address oldOwner = property.owner;
        require(oldOwner == msg.sender, "You are not the owner of this property");

        property.owner = _newOwner;

        emit PropertyTransferred(_propertyId, oldOwner, _newOwner);
    }

    function addLandmark(string memory _name, string memory _location, string memory _description) external {
        uint256 landmarkId = totalLandmarks;
        landmarks[landmarkId] = Landmark(_name, _location, _description);
        totalLandmarks++;

        emit LandmarkAdded(landmarkId, _name, _location, _description);
    }

    function searchLand(string memory _name, string memory _location) external view returns (uint256) {
        for (uint256 i = 0; i < totalProperties; i++) {
            Property storage property = properties[i];
            if (compareStrings(property.name, _name) && compareStrings(property.location, _location)) {
                return i;
            }
        }
        return 0;
    }

    function getLandInfo(uint256 _landId) external view returns (string memory, string memory, string memory) {
        require(_landId > 0 && _landId <= totalLandmarks, "Invalid land ID");

        Landmark storage landmark = landmarks[_landId];
        return (landmark.name, landmark.location, landmark.description);
    }

    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
}

