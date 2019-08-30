///////////////////////////////////////////////////////////////////////////////
//
//  XBR Open Data Markets - https://xbr.network
//
//  JavaScript client library for the XBR Network.
//
//  Copyright (C) Crossbar.io Technologies GmbH and contributors
//
//  Licensed under the Apache 2.0 License:
//  https://opensource.org/licenses/Apache-2.0
//
///////////////////////////////////////////////////////////////////////////////

let Web3 = require("web3");
let xbr = require('./ethereum.js');

const DomainStatus_NULL = 0;
const DomainStatus_ACTIVE = 1;
const DomainStatus_CLOSED = 2;

let SimpleBlockchain = function (gateway) {
    this.gateway = gateway;
    this.w3 = null;
};

SimpleBlockchain.prototype.start = function() {
    if (this.gateway != null) {
        return;
    }

    if (this.gateway == null) {
        this.w3 = new Web3(Web3.currentProvider);
    } else {
        this.w3 = new Web3(new Web3.providers.HttpProvider(this.gateway));
    }

    if (this.w3.isConnected()) {
        throw `could not connect to Web3/Ethereum at: ${this.gateway || 'auto'}`;
    } else {
        console.log(`Connected to network ${this.w3.version.network} at provider ${this.gateway || 'auto'}`)
    }
};

SimpleBlockchain.prototype.stop = function() {
    this.w3 = null;
};

SimpleBlockchain.prototype.getMarketStatus = async function(marketID) {
    let owner = xbr.xbrnetwork.getMarketOwner(marketID);
    if (owner == null || owner == "0x0000000000000000000000000000000000000000") {
        return null;
    } else {
        return {'owner': owner}
    }
};

SimpleBlockchain.prototype.getDomainStatus = async function(domainID) {
    status = xbr.xbrnetwork.getDomainStatus(domainID);
    if (status == DomainStatus_NULL) {
        return null;
    } else if (status == DomainStatus_ACTIVE) {
        return {'status': 'ACTIVE'}
    } else if (status == DomainStatus_CLOSED) {
        return {'status': 'CLOSED'}
    }
};

SimpleBlockchain.prototype.getNodeStatus = function(delegateAddr) {

};

SimpleBlockchain.prototype.getActorStatus = function(channelAddr) {

};

SimpleBlockchain.prototype.getDelegateStatus = function(delegateAddr) {

};

SimpleBlockchain.prototype.getChannelStatus = function(channelAddr) {

};

SimpleBlockchain.prototype.getMemberStatus = async function(memberAddr) {
    let level = xbr.xbrnetwork.getMemberLevel(memberAddr);
    if (level == null) {
        return null;
    }
    let eula = xbr.xbrnetwork.getMemberEula(memberAddr);
    if (eula == null || eula.trim() == '') {
        return null;
    }
    let profile = xbr.xbrnetwork.getMemberProfile(memberAddr);
    if (profile == null || profile.trim() == '') {
        profile = null;
    }
    return {
        'eula': eula,
        'profile': profile,
    }
};

SimpleBlockchain.prototype.getBalances = async function(accountAddr) {
    let balanceETH = await this.w3.eth.getBalance(accountAddr);
    let balanceXBR = await xbr.xbrtoken.balanceOf(accountAddr);
    return {
        'ETH': balanceETH,
        'XBR': balanceXBR,
    }
};

SimpleBlockchain.prototype.getContractAddr = function() {
    return {
        'XBRToken': xbr.xbrtoken.address,
        'XBRNetwork': xbr.xbrnetwork.address,
    }
};

exports.SimpleBlockchain = SimpleBlockchain;
