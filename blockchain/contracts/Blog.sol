// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract Blog {
    struct BlogPost {
        uint id;
        string title;
        string contentHash;
        address author; 
    }

    BlogPost[] public posts;
    uint public postCount = 0;

    event BlogCreated(uint id, string title, string contentHash, address author);

    function createPost(string memory title, string memory contentHash) public {
        postCount++;
        posts.push(BlogPost(postCount, title, contentHash, msg.sender));
        emit BlogCreated(postCount, title, contentHash, msg.sender);
    }

    function getPost(uint id) public view returns (BlogPost memory) {
        require(id > 0 && id <= postCount, "Invalid post ID");
        return posts[id - 1];
    }

    function getAllPosts() public view returns (BlogPost[] memory) {
        return posts;
    }
}