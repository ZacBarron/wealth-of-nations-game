// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract StarterPack is ERC721, Ownable {
    using Strings for uint256;
    
    uint256 private _nextTokenId;
    string private constant TOKEN_URI = "ipfs://bafkreigik42m7kgjpyuv3gagclure6c47hmcuqdfjnjkz3eqpuhwunw6aa";
    mapping(address => bool) public hasMinted;
    
    // Constants
    uint256 public constant MAX_SUPPLY = 10000;

    constructor() ERC721("Wealth of Nations Starter Pack", "WNSP") Ownable(msg.sender) {}

    function tokenURI(uint256) public pure override returns (string memory) {
        return TOKEN_URI;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return
            interfaceId == 0x80ac58cd || // ERC721 
            interfaceId == 0x5b5e139f || // ERC721Metadata
            super.supportsInterface(interfaceId);
    }

    function mint(address to) public {
        require(!hasMinted[to], "Address has already claimed a starter pack");
        require(_nextTokenId < MAX_SUPPLY, "Max supply reached");
        
        hasMinted[to] = true;
        _mint(to, _nextTokenId++);
    }

    function hasClaimedStarterPack(address user) public view returns (bool) {
        return hasMinted[user];
    }

    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }
}