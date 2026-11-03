let xmlDocument = null;


async function loadXML() {

    try {

        const response = await fetch("xml/quizzes.xml");

        if (!response.ok) {
            throw new Error("Could not load XML");
        }

        const xmlText = await response.text();

        const parser = new DOMParser();

        xmlDocument = parser.parseFromString(
            xmlText,
            "application/xml"
        );

        const parserError =
            xmlDocument.querySelector("parsererror");

        if (parserError) {
            throw new Error("XML parsing failed");
        }

        console.log("XML loaded successfully");

        return xmlDocument;

    } catch (error) {

        console.error(error);

        showNotification(
            "SYSTEM ERROR: XML DATA UNAVAILABLE"
        );

        throw error;
    }
}


/*
    XPath helper
*/

function xpathQuery(expression) {

    if (!xmlDocument) {
        return [];
    }

    const result = xmlDocument.evaluate(
        expression,
        xmlDocument,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
    );

    const nodes = [];

    for (let i = 0; i < result.snapshotLength; i++) {

        nodes.push(
            result.snapshotItem(i)
        );
    }

    return nodes;
}


/*
    Get an island using XPath
*/

function getIsland(islandId) {

    const result = xpathQuery(
        `/codeverse/island[@id='${islandId}']`
    );

    return result[0];
}


/*
    Get stages of an island
*/

function getStages(islandId) {

    return xpathQuery(
        `/codeverse/island[@id='${islandId}']/stage`
    );
}


/*
    Get questions of a stage
*/

function getQuestions(stageId) {

    return xpathQuery(
        `//stage[@id='${stageId}']/question`
    );
}