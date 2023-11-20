(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["webpackNumbers"] = factory();
	else
		root["webpackNumbers"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/opencascade.js/dist/opencascade.full.wasm":
/*!****************************************************************!*\
  !*** ./node_modules/opencascade.js/dist/opencascade.full.wasm ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("wasm/da1e7571cd100a1fcdc038af9ee52a40.wasm");

/***/ }),

/***/ "./src/commands/CSGCommandKind.ts":
/*!****************************************!*\
  !*** ./src/commands/CSGCommandKind.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CSGCommandKind: () => (/* binding */ CSGCommandKind)
/* harmony export */ });
var CSGCommandKind;
(function (CSGCommandKind) {
    CSGCommandKind["GetTopoShapeMetadata"] = "GetTopoShapeMetadata";
})(CSGCommandKind || (CSGCommandKind = {}));


/***/ }),

/***/ "./src/commands/commandExecutor.ts":
/*!*****************************************!*\
  !*** ./src/commands/commandExecutor.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CommandExecutor: () => (/* binding */ CommandExecutor)
/* harmony export */ });
/* harmony import */ var _CSGCommandKind__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CSGCommandKind */ "./src/commands/CSGCommandKind.ts");
/* harmony import */ var _csg_csgTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../csg/csgTypes */ "./src/csg/csgTypes.ts");


var CommandExecutor = /** @class */ (function () {
    function CommandExecutor(geometry, nodeCalculator) {
        this.geometry = geometry;
        this.nodeCalculator = nodeCalculator;
    }
    CommandExecutor.prototype.executeCommandJson = function (commandJson) {
        if (typeof commandJson !== 'string') {
            throw new Error("executeCommandJson expects string input.");
        }
        var command = JSON.parse(commandJson);
        return this.executeCommand(command);
    };
    CommandExecutor.prototype.executeCommand = function (command) {
        var result;
        switch (command.Command) {
            case _CSGCommandKind__WEBPACK_IMPORTED_MODULE_0__.CSGCommandKind.GetTopoShapeMetadata:
                result = this.getTopoShapeMetadata(command);
                break;
        }
        var resultJson = JSON.stringify(result, null, 2);
        return resultJson;
    };
    CommandExecutor.prototype.getTopoShapeMetadata = function (command) {
        var result;
        switch (command.Kind) {
            case _csg_csgTypes__WEBPACK_IMPORTED_MODULE_1__.CSGNodeMetadataKind.Mesh:
                result = this.getMesh(command);
                break;
            case _csg_csgTypes__WEBPACK_IMPORTED_MODULE_1__.CSGNodeMetadataKind.AABB:
                result = this.getAABB(command);
                break;
            case _csg_csgTypes__WEBPACK_IMPORTED_MODULE_1__.CSGNodeMetadataKind.OBB:
                result = this.getOBB(command);
                break;
        }
        return result;
    };
    CommandExecutor.prototype.getAABB = function (command) {
        var shape = this.nodeCalculator.calculateNodeShapesWithCache(command.Node)[0];
        var aabb = this.geometry.boundingBoxes.getAABB(shape, false);
        return aabb;
    };
    CommandExecutor.prototype.getOBB = function (command) {
        var shape = this.nodeCalculator.calculateNodeShapesWithCache(command.Node)[0];
        var obb = this.geometry.boundingBoxes.getOBB(shape, false);
        return obb;
    };
    CommandExecutor.prototype.getMesh = function (command) {
        var shape = this.nodeCalculator.calculateNodeShapesWithCache(command.Node)[0];
        var facesAndEdges = this.geometry.makeIntoSingleMesh_My(shape, true, command.TheLinDeflection, command.TheAngDeflection);
        var faceListData = { faces: facesAndEdges.faces };
        var edgeListData = { edges: facesAndEdges.edges };
        var mesh = {
            faceListData: faceListData,
            edgeListData: edgeListData
        };
        return mesh;
    };
    return CommandExecutor;
}());



/***/ }),

/***/ "./src/common/compounds.ts":
/*!*********************************!*\
  !*** ./src/common/compounds.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _occt_shapes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../occt/shapes */ "./src/occt/shapes.js");

var compounds = {
    oc: null,
    setOpenCascade: function (openCascade) {
        this.oc = openCascade;
    },
    /**
     *
     * @param shapes Array of shapes
     * @return {TopoDS_Compound}
     */
    makeCompound: function (shapes) {
        var oc = this.oc;
        // Building the Resulting Compound
        var aRes = new oc.TopoDS_Compound();
        var aBuilder = new oc.BRep_Builder();
        aBuilder.MakeCompound(aRes);
        shapes.forEach(function (shape) {
            aBuilder.Add(aRes, shape);
        });
        // aBuilder.Add(aRes, myBody.Shape());
        // aBuilder.Add(aRes, myThreading);
        return aRes;
    },
    deCompoundShape: function (shape, shapeTypeToAccept) {
        var oc = this.oc;
        shapeTypeToAccept = shapeTypeToAccept !== null && shapeTypeToAccept !== void 0 ? shapeTypeToAccept : oc.TopAbs_ShapeEnum.TopAbs_SOLID;
        var shapeType = shape.ShapeType();
        if (shapeType === shapeTypeToAccept) {
            return [shape];
        }
        if (shapeType !== oc.TopAbs_ShapeEnum.TopAbs_COMPOUND) {
            return [];
        }
        return this.listCompoundShapes(shape, shapeTypeToAccept);
    },
    /**
     * Lists shapes withign the compound compoundShape.
     * @param compoundShape
     * @param shapeTypeToAccept undefined by default
     * @return {*[]} List of shapes withing a given compound compoundShape
     *
     * export declare type TopAbs_ShapeEnum = {
     *   TopAbs_COMPOUND: {};
     *   TopAbs_COMPSOLID: {};
     *   TopAbs_SOLID: {};
     *   TopAbs_SHELL: {};
     *   TopAbs_FACE: {};
     *   TopAbs_WIRE: {};
     *   TopAbs_EDGE: {};
     *   TopAbs_VERTEX: {};
     *   TopAbs_SHAPE: {};
     * }
     */
    listCompoundShapes: function (compoundShape, shapeTypeToAccept) {
        var oc = this.oc;
        shapeTypeToAccept = shapeTypeToAccept !== null && shapeTypeToAccept !== void 0 ? shapeTypeToAccept : oc.TopAbs_ShapeEnum.TopAbs_SOLID;
        if (compoundShape.ShapeType() !== oc.TopAbs_ShapeEnum.TopAbs_COMPOUND) {
            throw new Error("listCompoundShapes(): Shape is not a compound. shape: ".concat(_occt_shapes__WEBPACK_IMPORTED_MODULE_0__["default"].getShapeTypeAsString(compoundShape)));
        }
        var subShapes = [];
        var anExplorer = new oc.TopExp_Explorer_1();
        for (anExplorer.Init(compoundShape, shapeTypeToAccept, oc.TopAbs_ShapeEnum.TopAbs_SHAPE); anExplorer.More(); anExplorer.Next()) {
            var current = anExplorer.Current();
            subShapes.push(current);
        }
        return subShapes;
    },
    /**
     *
     * @param shape A topo shape, compound or not
     * @return [ shape, ... ] An array of shapes, if input shape is a wire the returned array contains just the input shape
     */
    listWiresInsideCompound: function (shape) {
        var oc = this.oc;
        if (shape.ShapeType() === oc.TopAbs_ShapeEnum.TopAbs_WIRE) {
            return [shape];
        }
        return this.deCompoundShape(shape, oc.TopAbs_ShapeEnum.TopAbs_WIRE);
    },
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (compounds);


/***/ }),

/***/ "./src/common/createPromise.js":
/*!*************************************!*\
  !*** ./src/common/createPromise.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPromise: () => (/* binding */ createPromise)
/* harmony export */ });
function createPromise() {
    var _resolve, _reject;
    var promise = new Promise(function (resolve, reject) {
        _resolve = resolve;
        _reject = reject;
    });
    promise.resolve = _resolve;
    promise.reject = _reject;
    return promise;
}


/***/ }),

/***/ "./src/common/featureFlags.js":
/*!************************************!*\
  !*** ./src/common/featureFlags.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var ff = {
    sendBackNodeDebugData: true,
    sendBackShapeVerticesData: false,
    sendBackShapeUserData: true,
    attachCSGNodeToShapeResult: true
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ff);


/***/ }),

/***/ "./src/common/geometry.js":
/*!********************************!*\
  !*** ./src/common/geometry.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _openCascadeHelper_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./openCascadeHelper.js */ "./src/common/openCascadeHelper.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/common/utils.js");
/* harmony import */ var _vectors_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./vectors.js */ "./src/common/vectors.js");
/* harmony import */ var _occt_booleans__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../occt/booleans */ "./src/occt/booleans.ts");
/* harmony import */ var _occt_faces__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../occt/faces */ "./src/occt/faces.ts");
/* harmony import */ var _occt_shapes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../occt/shapes */ "./src/occt/shapes.js");
/* harmony import */ var _occt_sweeps__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../occt/sweeps */ "./src/occt/sweeps.js");
/* harmony import */ var _occt_projections__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../occt/projections */ "./src/occt/projections.ts");
/* harmony import */ var _occt_solidOperations__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../occt/solidOperations */ "./src/occt/solidOperations.ts");
/* harmony import */ var _occt_boundingBoxes__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../occt/boundingBoxes */ "./src/occt/boundingBoxes.ts");
/* harmony import */ var _compounds__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./compounds */ "./src/common/compounds.ts");
/* harmony import */ var _wires_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./wires.js */ "./src/common/wires.js");
/* harmony import */ var _wireToSolid_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./wireToSolid.js */ "./src/common/wireToSolid.js");
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./math */ "./src/common/math.js");
/* harmony import */ var _common_visualize__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../common/visualize */ "./src/common/visualize.js");
/* harmony import */ var _occt_occtio__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../occt/occtio */ "./src/occt/occtio.ts");
















var geometry = {
    setOpenCascade: function (openCascade) {
        _openCascadeHelper_js__WEBPACK_IMPORTED_MODULE_0__["default"].setOpenCascade(openCascade);
        this.openCascade = openCascade;
        _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].setOpenCascade(openCascade);
        _vectors_js__WEBPACK_IMPORTED_MODULE_2__["default"].setOpenCascade(openCascade);
        _occt_booleans__WEBPACK_IMPORTED_MODULE_3__["default"].setOpenCascade(openCascade);
        _occt_faces__WEBPACK_IMPORTED_MODULE_4__["default"].setOpenCascade(openCascade);
        _occt_shapes__WEBPACK_IMPORTED_MODULE_5__["default"].setOpenCascade(openCascade);
        _occt_sweeps__WEBPACK_IMPORTED_MODULE_6__["default"].setOpenCascade(openCascade);
        _compounds__WEBPACK_IMPORTED_MODULE_10__["default"].setOpenCascade(openCascade);
        _wires_js__WEBPACK_IMPORTED_MODULE_11__["default"].setOpenCascade(openCascade);
        _wireToSolid_js__WEBPACK_IMPORTED_MODULE_12__["default"].setOpenCascade(openCascade);
        _common_visualize__WEBPACK_IMPORTED_MODULE_14__["default"].setOpenCascade(openCascade);
        _occt_projections__WEBPACK_IMPORTED_MODULE_7__["default"].setOpenCascade(openCascade);
        _occt_solidOperations__WEBPACK_IMPORTED_MODULE_8__["default"].setOpenCascade(openCascade);
        _occt_boundingBoxes__WEBPACK_IMPORTED_MODULE_9__["default"].setOpenCascade(openCascade);
        _occt_occtio__WEBPACK_IMPORTED_MODULE_15__["default"].setOpenCascade(openCascade);
        this.utils = _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"];
        this.vectors = _vectors_js__WEBPACK_IMPORTED_MODULE_2__["default"];
        this.booleans = _occt_booleans__WEBPACK_IMPORTED_MODULE_3__["default"];
        this.faces = _occt_faces__WEBPACK_IMPORTED_MODULE_4__["default"];
        this.shapes = _occt_shapes__WEBPACK_IMPORTED_MODULE_5__["default"];
        this.sweeps = _occt_sweeps__WEBPACK_IMPORTED_MODULE_6__["default"];
        this.compounds = _compounds__WEBPACK_IMPORTED_MODULE_10__["default"];
        this.wires = _wires_js__WEBPACK_IMPORTED_MODULE_11__["default"];
        this.wireToSolid = _wireToSolid_js__WEBPACK_IMPORTED_MODULE_12__["default"];
        this.visualize = _common_visualize__WEBPACK_IMPORTED_MODULE_14__["default"];
        this.projections = _occt_projections__WEBPACK_IMPORTED_MODULE_7__["default"];
        this.solidOperations = _occt_solidOperations__WEBPACK_IMPORTED_MODULE_8__["default"];
        this.boundingBoxes = _occt_boundingBoxes__WEBPACK_IMPORTED_MODULE_9__["default"];
        this.occtio = _occt_occtio__WEBPACK_IMPORTED_MODULE_15__["default"];
    },
    makeIntoSingleMesh_My: function (shape, addEdges, theLinDeflection, theAngDeflection) {
        var oc = this.openCascade;
        var shapes = this.compounds.deCompoundShape(shape, oc.TopAbs_ShapeEnum.TopAbs_SOLID);
        var facelist = [];
        shapes.forEach(function (ss) {
            var shapeFacelist = _openCascadeHelper_js__WEBPACK_IMPORTED_MODULE_0__["default"].tessellate(ss, theLinDeflection, theAngDeflection);
            facelist = facelist.concat(shapeFacelist);
        });
        var faces = facelist.map(function (face) {
            var vectors = [];
            for (var i = 0; i < face.vertex_coord.length; i += 3) {
                var vector = {
                    x: face.vertex_coord[i],
                    y: face.vertex_coord[i + 1],
                    z: face.vertex_coord[i + 2]
                };
                vectors.push(vector);
            }
            return {
                vertex_coord: vectors,
                vertexCount: vectors.length,
                // tri_indexes: triangles,
                // tri_indexes: [],
                tri_indexes: face.tri_indexes.map(function (index) { return index - 1; }),
                tri_indexesCount: face.tri_indexes.length,
                // number_of_triangles: tot_triangle_count,
            };
        });
        var edges = [];
        if (addEdges) {
            edges = facelist
                .map(function (face) { return face.edgeList; }).flat()
                .map(function (edge, index) {
                edge.original_edge_index = edge.edge_index;
                edge.edge_index = index;
                var vectors = [];
                for (var i = 0; i < edge.vertex_coord.length; i += 3) {
                    var vector = {
                        x: edge.vertex_coord[i],
                        y: edge.vertex_coord[i + 1],
                        z: edge.vertex_coord[i + 2]
                    };
                    vectors.push(vector);
                }
                edge.vertex_coord = vectors;
                return edge;
            });
        }
        var facesEdgesAlreadyAdded = edges.length > 0;
        if (addEdges && !facesEdgesAlreadyAdded) {
            var edgeList = _common_visualize__WEBPACK_IMPORTED_MODULE_14__["default"].ShapeToEdges(shape, theLinDeflection, theAngDeflection).edgeList;
            edges = edges.concat(edgeList);
        }
        return { faces: faces, edges: edges };
        // return { faces: [face] }
    },
    getShapePosition_gp_XYZ: function (shape) {
        var oc = this.openCascade;
        if (shape.ShapeType() === oc.TopAbs_ShapeEnum.TopAbs_VERTEX) {
            var vertex = this.shapes.getActualTypeOfShape(shape);
            var pnt = oc.BRep_Tool.Pnt(vertex);
            return pnt.XYZ();
        }
        var shapeTranslationPart_gp_XYZ = shape.Location_1().Transformation().TranslationPart();
        return shapeTranslationPart_gp_XYZ;
    },
    getShapeRotation_gp_Quaternion: function (shape) {
        var rotation_gp_Quaternion = shape.Location_1().Transformation().GetRotation_2();
        return rotation_gp_Quaternion;
    },
    /**
     * Taken from: https://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm
     * @param q
     * @return { angle: Number, axis:[x, y, z] }
     */
    getQuaternionAngleAxis_Custom: function (q) {
        // //// console.log(`quaternion is q.X: ${q.X()} q.Y: ${q.Y()} q.Z: ${q.Z()} q.W: ${q.W()}`)
        var oc = this.openCascade;
        var angleRad = 2 * Math.acos(q.W());
        var s = Math.sqrt(1 - q.W() * q.W());
        // case where angle is 0 (qw == 0)
        if (s === 0)
            s = 1;
        var axisX = q.X() / s;
        var axisY = q.Y() / s;
        var axisZ = q.Z() / s;
        if (s === 0)
            axisX = 1;
        return { angle: angleRad, axis: [axisX, axisY, axisZ] };
    },
    getQuaternionAngleAxis: function (q) {
        // //// console.log(`quaternion is q.X: ${q.X()} q.Y: ${q.Y()} q.Z: ${q.Z()} q.W: ${q.W()}`)
        var oc = this.openCascade;
        var ref_vec = new oc.gp_Vec_1();
        var ref_angle = { current: 0 };
        q.GetVectorAndAngle(ref_vec, ref_angle);
        return { angle: ref_angle.current, axis: [ref_vec.X(), ref_vec.Y(), ref_vec.Z()] };
    },
    /**
     *
     * @param points An array of arrays. Each sub array is a 3d point [[x,y,z], [x,y,z], (...)]
     * @returns {TopoDS_Compound}
     */
    makePolygon: function (points) {
        if (points.length < 3)
            throw new Error('Cannot make polygon out of less than 3 points.');
        if (points.length < 4)
            throw new Error('Cannot make polygon out of more than 4 points.');
        var openCascade = this.openCascade;
        var builder = new openCascade.BRep_Builder();
        var aComp = new openCascade.TopoDS_Compound();
        builder.MakeCompound(aComp);
        // const path = [[-50, 0, 0], [50, 0, 0], [50, 100, 0]].map(([x, y, z]) => new openCascade.gp_Pnt_3(x, y, z));
        var path = points.map(function (_a) {
            var x = _a[0], y = _a[1], z = _a[2];
            return new openCascade.gp_Pnt_3(x, y, z);
        });
        var makePolygon = points.length === 3
            ? new openCascade.BRepBuilderAPI_MakePolygon_3(path[0], path[1], path[2], true)
            : new openCascade.BRepBuilderAPI_MakePolygon_4(path[0], path[1], path[2], path[3], true);
        var wire = makePolygon.Wire();
        var f = new openCascade.BRepBuilderAPI_MakeFace_15(wire, false);
        builder.Add(aComp, f.Shape());
        return aComp;
    },
    makeSphere: function (x, y, z, radius) {
        var oc = this.openCascade;
        var p = new oc.gp_Pnt_3(0, 0, 0);
        var sphereShape = new oc.BRepPrimAPI_MakeSphere_5(p, radius).Shape();
        sphereShape = this.doTranslate(sphereShape, [x, y, z]);
        return sphereShape;
    },
    /**
     * Creates a cylinder shape.
     *
     * @param a [x,y,z] start point
     * @param b [x,y,z] end point
     * @param radius radius float radius value
     * @returns {any} cylinder shape
     */
    makeCylinderAB: function (a, b, radius) {
        var oc = this.openCascade;
        // export declare class gp_Ax2_3 extends gp_Ax2 {
        //         constructor(P: gp_Pnt, V: gp_Dir);
        //     }
        // export declare class gp_Dir_4 extends gp_Dir {
        //         constructor(theXv: Standard_Real, theYv: Standard_Real, theZv: Standard_Real);
        //     }
        var pA = new oc.gp_Pnt_3(a[0], a[1], a[2]);
        var pB = new oc.gp_Pnt_3(b[0], b[1], b[2]);
        var pCenter = pA.XYZ().Add(pB.XYZ());
        pCenyer.Muliply(0.5);
        pA = new oc.gp_Pnt_2(pA.XYZ().Subtract(pCenter));
        pB = new oc.gp_Pnt_2(pB.XYZ().Subtract(pCenter));
        var dir = new oc.gp_Dir_4(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
        var axis = new oc.gp_Ax2_3(pA, dir);
        var height = pA.Distance(pB);
        var cylinderShape = new oc.BRepPrimAPI_MakeCylinder_3(axis, radius.height).Shape();
        cylinderShape = this.doTranslate(cylinderShape, [pCenter.X(), pCenter.Y(), pCenter.Z()]);
        return cylinderShape;
    },
    /**
     * Creates a cylinder shape.
     *
     * @param a [x,y,z] start point
     * @param dir [x,y,z] cylinder main axis direction vector
     * @param radius float radius value
     * @param radius float height value
     * @returns {any} cylinder shape
     */
    makeCylinder: function (a, dir, radius, height) {
        var oc = this.openCascade;
        // export declare class gp_Ax2_3 extends gp_Ax2 {
        //         constructor(P: gp_Pnt, V: gp_Dir);
        //     }
        // export declare class gp_Dir_4 extends gp_Dir {
        //         constructor(theXv: Standard_Real, theYv: Standard_Real, theZv: Standard_Real);
        //     }
        // let gp_p = new oc.gp_Pnt_3(a[0], a[1], a[2]);
        var gp_p = new oc.gp_Pnt_3(0, 0, 0);
        var gp_dir = new oc.gp_Dir_4(dir[0], dir[1], dir[2]);
        var axis = new oc.gp_Ax2_3(gp_p, gp_dir);
        var cylinderShape = new oc.BRepPrimAPI_MakeCylinder_3(axis, radius, height).Shape();
        cylinderShape = this.doTranslate(cylinderShape, a);
        return cylinderShape;
    },
    makeBox: function (px, py, pz, width, height, depth, pivotX, pivotY, pivotZ) {
        var oc = this.openCascade;
        var ix = depth * pivotX * -1;
        var iy = width * pivotY * -1;
        var iz = height * pivotZ * -1;
        var p = new oc.gp_Pnt_3(ix, iy, iz);
        // let shape = new oc.BRepPrimAPI_MakeBox_3(p, width, height, depth).Shape();
        var shape = new oc.BRepPrimAPI_MakeBox_3(p, depth, width, height).Shape();
        shape = this.doTranslate(shape, [px, py, pz]);
        return shape;
    },
    /**
     *
     * @param normal
     * @param point
     * @param w
     * @param h
     * @param px pivot x (normalised)
     * @param py pivot y (normalised)
     * @returns {TopoDS_Compound}
     */
    makePlane: function (normal, point, w, h, px, py) {
        var oc = this.openCascade;
        // quad in XY plane
        var points = [
            [-w * px, -h * py, 0],
            [w * px, -h * py, 0],
            [w * px, h * py, 0],
            [-w * px, h * py, 0]
        ];
        var from = new oc.gp_Vec_4(0, 0, 1);
        var to = new oc.gp_Vec_4(normal[0], normal[1], normal[2]);
        var rotate = new oc.gp_Quaternion_3(from, to);
        var polygon = this.makePolygon(points);
        _occt_shapes__WEBPACK_IMPORTED_MODULE_5__["default"].rotate_gp_Quaternion(polygon, rotate);
        _occt_shapes__WEBPACK_IMPORTED_MODULE_5__["default"].translate(polygon, point);
        return polygon;
    },
    diff: function (shapeA, shapeB, cut) {
        var oc = this.openCascade;
        var progressRange = new oc.Message_ProgressRange_1();
        var args = new oc.TopTools_ListOfShape_1();
        args.Append_1(shapeA);
        var tools = new oc.TopTools_ListOfShape_1();
        tools.Append_1(shapeB);
        cut.SetFuzzyValue(0.1);
        cut.SetArguments(args);
        cut.SetTools(tools);
        cut.Build(progressRange);
        if (cut.HasErrors()) {
            throw new Error("Cut operation resulted with error(s).");
        }
        return cut.Shape();
    },
    makeDifference: function (mainShape, shapesToSubtract, keepEdges) {
        var _this = this;
        var oc = this.openCascade;
        if (!mainShape || mainShape.IsNull()) {
            throw new Error("makeDifference: mainShape is null");
        }
        var cut = new oc.BRepAlgoAPI_Cut_1();
        var explodedShapesToSubtract = shapesToSubtract
            .map(function (shape) { return _this.compounds.deCompoundShape(shape); })
            .flat(1);
        var difference = mainShape;
        for (var i = 0; i < explodedShapesToSubtract.length; i++) {
            difference = this.diff(difference, explodedShapesToSubtract[i], cut);
        }
        if (!keepEdges) {
            var fusor = new oc.ShapeUpgrade_UnifySameDomain_2(difference, true, false, false);
            fusor.Build();
            difference = fusor.Shape();
        }
        return difference;
    },
    /**
     *
     * @param mainShapes Array of shapes
     * @param shapesToSubtract
     * @param keepEdges
     * @return {TopoDS_Shape}
     */
    makeDifferenceMulti: function (mainShapes, shapesToSubtract, keepEdges) {
        var _this = this;
        var oc = this.openCascade;
        mainShapes = mainShapes.map(function (shape) { return _this.compounds.deCompoundShape(shape); })
            .flat(1);
        var results = [];
        for (var i = 0; i < mainShapes.length; i++) {
            var result = this.makeDifference(mainShapes[i], shapesToSubtract, keepEdges);
            results.push(result);
        }
        // // console.log("mainShapes: ",mainShapes.length);
        // // console.log("results: ",results.length);
        return results.length > 1
            ? this.compounds.makeCompound(results)
            : results[0];
    },
    makeIntersection: function (objectsToIntersect, fuzzValue, keepEdges) {
        var oc = this.openCascade;
        if (!fuzzValue) {
            fuzzValue = 0.1;
        }
        var intersected = objectsToIntersect[0];
        if (objectsToIntersect.length > 1) {
            for (var i = 1; i < objectsToIntersect.length; i++) {
                var progressRange = new oc.Message_ProgressRange_1();
                var intersectedCommon = new oc.BRepAlgoAPI_Common_3(intersected, objectsToIntersect[i], progressRange);
                //
                // intersectedCommon.SetFuzzyValue(fuzzValue);
                // intersectedCommon.Build(progressRange);
                intersected = intersectedCommon.Shape();
            }
        }
        if (!keepEdges) {
            var fusor = new oc.ShapeUpgrade_UnifySameDomain_2(intersected, true, false, false);
            fusor.Build();
            intersected = fusor.Shape();
        }
        return intersected;
    },
    makeSplit: function (shape, tool) {
        var oc = this.openCascade;
        var splitter = new oc.BOPAlgo_Splitter_1();
        var args = new oc.TopTools_ListOfShape_1();
        args.Append_1(shape);
        var tools = new oc.TopTools_ListOfShape_1();
        tools.Append_1(tool);
        // splitter.SetFuzzyValue(0.1);
        splitter.SetArguments(args);
        splitter.SetTools(tools);
        var progressRange = new oc.Message_ProgressRange_1();
        splitter.Perform(progressRange);
        if (splitter.HasErrors()) {
            throw new Error("Split operation resulted in errors.");
        }
        var splittedShape = splitter.Shape();
        return splittedShape;
    },
    /**
     *
     * @param shape TopoDS_Shape to split.
     * @param tool TopoDS_Shape plane.
     * @param planePoint [x,y,z] plane point.
     * @param planeNormal [x,y,z] plane normal vector.
     * @returns {TopoDS_Shape} A compound shape holding all split result shapes that were on the positive side of the plane.
     */
    makeSplitWithPlane: function (shape, tool, planePoint, planeNormal) {
        var _this = this;
        var oc = this.openCascade;
        var splittedShape = this.makeSplit(shape, tool);
        // return splittedShape;
        if (splittedShape.ShapeType() !== oc.TopAbs_ShapeEnum.TopAbs_COMPOUND) {
            throw new Error("makeSplitWithPlane() did not produce a compound shape. No actual split happened.");
            // return shape;
        }
        // now lets drop off the "plane's negative side" split result shape
        var positiveSubShapes = [];
        var negativeSubShapes = [];
        var onPlaneSubShapes = [];
        var subShapes = this.compounds.listCompoundShapes(splittedShape);
        subShapes.forEach(function (subShape) {
            var planeRelation = _this.shapes.getShapeToPlaneOrientation(subShape, planePoint, planeNormal);
            //// console.log("planeRelation.isPositive: "+planeRelation.isPositive+" planeRelation.isNegative: "+planeRelation.isNegative);
            if (planeRelation.isPositive) {
                positiveSubShapes.push(subShape);
                //// console.log("adding positive sub shape")
            }
            else if (planeRelation.isNegative) {
                negativeSubShapes.push(subShape);
                //// console.log("adding negative sub shape")
            }
            else if (planeRelation.isAllOnPlane) {
                onPlaneSubShapes.push(subShape);
                //// console.log("adding onPlane sub shape")
            }
        });
        if (positiveSubShapes.length === 0) {
            throw new Error("No positive shapes has been found in split results shapes.");
        }
        //// console.log("returning positiveCompound from positiveSubShapes: "+positiveSubShapes.length);
        var positiveCompound = this.compounds.makeCompound(positiveSubShapes);
        return positiveCompound;
    },
    /**
     * Creates a face on XY plane.
     * @param lines List of lines where each line is { a: [x,y,z], b: [x,y,z] }
     * @param point [x, y, z] where to position the face
     * @param notrmal [x, y, z] how to rotate the face so that inital face normal (Z forward) becomes same as normal
     */
    makeFaceFromLinesAndPlane: function (lines, point, normal, planeRotationZ) {
        var oc = this.openCascade;
        /// 1 - Create face
        var wires = lines.map(function (line) {
            // support points
            var pa = new oc.gp_Pnt_3(line.a[0], line.a[1], line.a[2]);
            var pb = new oc.gp_Pnt_3(line.b[0], line.b[1], line.b[2]);
            // geometry
            var segment = new oc.GC_MakeSegment_1(pa, pb);
            // topology
            var edge = new oc.BRepBuilderAPI_MakeEdge_24(new openCascade.Handle_Geom_Curve_2(segment.Value().get()));
            var wire = new oc.BRepBuilderAPI_MakeWire_2(edge.Edge());
            return wire;
        });
        var mkWire = new oc.BRepBuilderAPI_MakeWire_1();
        wires.forEach(function (wire) { return mkWire.Add_2(wire.Wire()); });
        var wireProfile = mkWire.Wire();
        var faceProfile = new oc.BRepBuilderAPI_MakeFace_15(wireProfile, false);
        var face = faceProfile.Face();
        /// 2 - Position and orient face
        var zAxisVec = new oc.gp_Vec_4(0, 0, 1);
        var zAngleRad = _math__WEBPACK_IMPORTED_MODULE_13__["default"].degToRad(planeRotationZ);
        var rotateZ = new oc.gp_Quaternion_5(zAxisVec, zAngleRad);
        this.shapes.rotate_gp_Quaternion(face, rotateZ);
        var from = new oc.gp_Vec_4(0, 0, 1);
        var to = new oc.gp_Vec_4(normal[0], normal[1], normal[2]);
        var rotate = new oc.gp_Quaternion_3(from, to);
        this.shapes.rotate_gp_Quaternion(face, rotate);
        this.shapes.translate(face, point);
        return face;
    },
    /**
     * Creates a face from wires.
     * @param wireShapes List of wires
     */
    makeFaceFromWires: function (wireShapes) {
        var oc = this.openCascade;
        // // console.log("makeFaceFromWires oc: ", oc);
        wireShapes = wireShapes.map(function (wireShape) { return _compounds__WEBPACK_IMPORTED_MODULE_10__["default"].listWiresInsideCompound(wireShape); }).flat(1);
        var mkWire = new oc.BRepBuilderAPI_MakeWire_1();
        var index = 0;
        wireShapes.forEach(function (wireShape) {
            // console.log(`### checking wire[${index++}]: ${this.shapes.getShapeTypeAsString(wireShape)}`);
            // let wire = this.wires.listWiresFromShape(wireShape);
            // wireShape = compounds.listWiresInsideCompound(wireShape)[0];
            var wire = new oc.TopoDS.Wire_1(wireShape);
            if (index == 1) {
                wire.Reverse();
            }
            mkWire.Add_2(wire);
        });
        var face = undefined;
        try {
            var wireProfile = mkWire.Wire();
            // console.log("makeFaceFromWires wireProfile: ", wireProfile);
            var faceProfile = new oc.BRepBuilderAPI_MakeFace_15(wireProfile, false);
            face = faceProfile.Face();
            // console.log("makeFaceFromWires face: ", face);
        }
        catch (error) {
            console.error("Wire error: ", error.message);
        }
        /// 2 - Position and orient face
        // const zAxisVec = new oc.gp_Vec_4(0,0,1);
        // const zAngleRad = math.degToRad(planeRotationZ);
        // let rotateZ = new oc.gp_Quaternion_5(zAxisVec, zAngleRad);
        // this.shapes.rotate_gp_Quaternion(face, rotateZ);
        // let from = new oc.gp_Vec_4(0, 0, 1);
        // let to = new oc.gp_Vec_4(normal[0], normal[1], normal[2]);
        // let rotate = new oc.gp_Quaternion_3(from, to);
        // this.shapes.rotate_gp_Quaternion(face, rotate);
        // this.shapes.translate(face, point);
        return face;
    },
    /**
     *
     * @param shape
     * @param offset
     */
    makeOffset: function (shape, offset, mode) {
        var oc = this.openCascade;
        shape = this.makeClone(shape);
        var progressRange = new oc.Message_ProgressRange_1();
        // let thickener = new oc.BRepOffsetAPI_MakeThickSolid();
        // thickener.MakeThickSolidBySimple(shape, offset);
        // thickener.Build(progressRange);
        var thickener = new oc.BRepOffsetAPI_MakeOffsetShape();
        // thickener.PerformBySimple(theS: TopoDS_Shape, theOffsetValue: Standard_Real): void;
        if (mode === 3) {
            thickener.PerformBySimple(shape, offset);
        }
        else {
            // // PerformByJoin(S: TopoDS_Shape, Offset: Standard_Real, Tol: Standard_Real, Mode: BRepOffset_Mode, Intersection: Standard_Boolean, SelfInter: Standard_Boolean, Join: GeomAbs_JoinType, RemoveIntEdges: Standard_Boolean, theRange: Message_ProgressRange): void;
            thickener.PerformByJoin(shape, offset, oc.Precision.Confusion(), oc.BRepOffset_Mode.BRepOffset_Skin, false, false, mode == 0 ? oc.GeomAbs_JoinType.GeomAbs_Arc : oc.GeomAbs_JoinType.GeomAbs_Intersection, false, progressRange);
        }
        var thickened = thickener.Shape();
        return thickened;
    },
    makeClone: function (shape) {
        var oc = this.openCascade;
        var copy = new oc.BRepBuilderAPI_Copy_1();
        copy.Perform(shape, false, false);
        var copied = copy.Shape();
        return copied;
        // return shape;
    },
    /**
     *
     * @param shape
     * @returns {*[]} [shape, ... ] an array of shapes of compound
     */
    explodeCompound: function (shape) {
        var oc = this.openCascade;
        if (shape.ShapeType() !== oc.TopAbs_ShapeEnum.TopAbs_COMPOUND) {
            return [shape];
        }
        var shapes = this.compounds.listCompoundShapes(shape);
        return shapes;
    },
    /**
     *
     * @param shape
     * @param offset [x, y, z] 3d vector in form of an array
     * @returns {TopoDS_Shape}
     */
    makeTranslate: function (shape, offset) {
        var oc = this.openCascade;
        var transformation = new oc.gp_Trsf_1();
        transformation.SetTranslation_1(new oc.gp_Vec_4(offset[0], offset[1], offset[2]));
        var translation = new oc.TopLoc_Location_2(transformation);
        var translated = shape.Moved(translation, true);
        return translated;
    },
    /**
     *
     * @param shape
     * @param offset [x,y,z]
     * @returns {*}
     */
    doTranslate: function (shape, offset) {
        var oc = this.openCascade;
        var transformation = new oc.gp_Trsf_1();
        transformation.SetTranslation_1(new oc.gp_Vec_4(offset[0], offset[1], offset[2]));
        var translation = new oc.TopLoc_Location_2(transformation);
        shape.Move(translation, true);
        return shape;
    },
    /**
     *
     * @param shape
     * @param scale [x, y, z] 3d vector in form of an array
     * @returns {Handle_TCollection_HAsciiString | TopoDS_Shape}
     */
    makeScale: function (shape, scale) {
        //// console.log(`trying to scale a shape ${shape} with scale: ${scale}`)
        var oc = this.openCascade;
        var shapeTranslationPart_gp_XYZ = this.getShapePosition_gp_XYZ(shape);
        // //// console.log(`shape position is ${shapeTranslationPart_gp_XYZ}`);
        // //// console.log(`shape position as array is ${[shapeTranslationPart_gp_XYZ.X(), shapeTranslationPart_gp_XYZ.Y(), shapeTranslationPart_gp_XYZ.Z()]}`);
        var px = shapeTranslationPart_gp_XYZ.X();
        var py = shapeTranslationPart_gp_XYZ.Y();
        var pz = shapeTranslationPart_gp_XYZ.Z();
        var mIdentity = new oc.gp_Mat_1();
        mIdentity.SetIdentity();
        var gtrsf_backToOrigin = new oc.gp_GTrsf_3(mIdentity, new oc.gp_XYZ_2(-px, -py, -pz));
        var gtrsf_backToPosition = new oc.gp_GTrsf_3(mIdentity, new oc.gp_XYZ_2(px, py, pz));
        var m = new oc.gp_Mat_1();
        m.SetDiagonal(scale[0], scale[1], scale[2]);
        var gtrsf_scale = new oc.gp_GTrsf_3(m, new oc.gp_XYZ_2(0, 0, 0));
        var gtrsf = gtrsf_backToPosition.Multiplied(gtrsf_scale).Multiplied(gtrsf_backToOrigin);
        var builder = new oc.BRepBuilderAPI_GTransform_2(shape, gtrsf, true);
        var scaled = builder.Shape();
        return scaled;
    },
    /**
     *
     * @param shape
     * @param point [x, y, z] rotation center
     * @param axis [x, y, z]
     * @param angleRad angle in radians
     */
    makeRotation: function (shape, axis, angleRad) {
        var oc = this.openCascade;
        //// console.log(`makeRotation with shape: ${shape} axis: ${axis} angleRad: ${angleRad}`);
        var aroundShapePosition = false;
        var shapePosition_gp_XYZ = this.getShapePosition_gp_XYZ(shape);
        var p = aroundShapePosition
            ? new oc.gp_Pnt_2(shapePosition_gp_XYZ)
            : new oc.gp_Pnt_3(0, 0, 0);
        // let p = new oc.gp_Pnt_3(point[0], point[1], point[2]);
        var dir = new oc.gp_Dir_4(axis[0], axis[1], axis[2]);
        var qAxis = new oc.gp_Ax1_2(p, dir);
        var transformation = new oc.gp_Trsf_1();
        transformation.SetRotation_1(qAxis, angleRad);
        var location = new oc.TopLoc_Location_2(transformation);
        var rotated = shape.Moved(location, true);
        return rotated;
    },
    /**
     *
     * @param shape
     * @param point [x, y, z] A rotation center
     * @param axis [x, y, z]
     * @param angleRad angle in radians
     */
    makeRotationAround: function (shape, center, axis, angleRad) {
        var oc = this.openCascade;
        //// console.log(`makeRotation with shape: ${shape} axis: ${axis} angleRad: ${angleRad}`);
        var shapePosition_gp_XYZ = this.getShapePosition_gp_XYZ(shape);
        var p = new oc.gp_Pnt_3(point[0], point[1], point[2]);
        var dir = new oc.gp_Dir_4(axis[0], axis[1], axis[2]);
        var qAxis = new oc.gp_Ax1_2(p, dir);
        var transformation = new oc.gp_Trsf_1();
        transformation.SetRotation_1(qAxis, angleRad);
        var location = new oc.TopLoc_Location_2(transformation);
        var rotated = shape.Moved(location, true);
        return rotated;
    },
    doRotate: function (shape, axis, angleRad) {
        var oc = this.openCascade;
        //// console.log(`makeRotation with shape: ${shape} axis: ${axis} angleRad: ${angleRad}`);
        var shapePosition_gp_XYZ = this.getShapePosition_gp_XYZ(shape);
        var p = new oc.gp_Pnt_2(shapePosition_gp_XYZ);
        var dir = new oc.gp_Dir_4(axis[0], axis[1], axis[2]);
        var qAxis = new oc.gp_Ax1_2(p, dir);
        var transformation = new oc.gp_Trsf_1();
        transformation.SetRotation_1(qAxis, angleRad);
        var location = new oc.TopLoc_Location_2(transformation);
        var rotated = shape.Move(location, true);
        return rotated;
    },
    resetLocation: function (shape) {
        // let oc  = this.openCascade;
        var inverted = shape.Location_1().Inverted();
        var originated = shape.Moved(inverted, true);
        return originated;
    },
    makeBottle: function (myWidth, myHeight, myThickness) {
        //// console.log("makeBottle myWidth: ", myWidth)
        //// console.log("makeBottle myHeight: ", myHeight)
        //// console.log("makeBottle myThickness: ", myThickness)
        var openCascade = this.openCascade;
        // Profile : Define Support Points
        var aPnt1 = new openCascade.gp_Pnt_3(-myWidth / 2., 0, 0);
        var aPnt2 = new openCascade.gp_Pnt_3(-myWidth / 2., -myThickness / 4., 0);
        var aPnt3 = new openCascade.gp_Pnt_3(0, -myThickness / 2., 0);
        var aPnt4 = new openCascade.gp_Pnt_3(myWidth / 2., -myThickness / 4., 0);
        var aPnt5 = new openCascade.gp_Pnt_3(myWidth / 2., 0, 0);
        // Profile : Define the Geometry
        var anArcOfCircle = new openCascade.GC_MakeArcOfCircle_4(aPnt2, aPnt3, aPnt4);
        var aSegment1 = new openCascade.GC_MakeSegment_1(aPnt1, aPnt2);
        var aSegment2 = new openCascade.GC_MakeSegment_1(aPnt4, aPnt5);
        // Profile : Define the Topology
        var anEdge1 = new openCascade.BRepBuilderAPI_MakeEdge_24(new openCascade.Handle_Geom_Curve_2(aSegment1.Value().get()));
        var anEdge2 = new openCascade.BRepBuilderAPI_MakeEdge_24(new openCascade.Handle_Geom_Curve_2(anArcOfCircle.Value().get()));
        var anEdge3 = new openCascade.BRepBuilderAPI_MakeEdge_24(new openCascade.Handle_Geom_Curve_2(aSegment2.Value().get()));
        var aWire = new openCascade.BRepBuilderAPI_MakeWire_4(anEdge1.Edge(), anEdge2.Edge(), anEdge3.Edge());
        // Complete Profile
        var xAxis = openCascade.gp.OX();
        var aTrsf = new openCascade.gp_Trsf_1();
        aTrsf.SetMirror_2(xAxis);
        var aBRepTrsf = new openCascade.BRepBuilderAPI_Transform_2(aWire.Wire(), aTrsf, false);
        var aMirroredShape = aBRepTrsf.Shape();
        var mkWire = new openCascade.BRepBuilderAPI_MakeWire_1();
        mkWire.Add_2(aWire.Wire());
        mkWire.Add_2(openCascade.TopoDS.Wire_1(aMirroredShape));
        var myWireProfile = mkWire.Wire();
        // Body : Prism the Profile
        var myFaceProfile = new openCascade.BRepBuilderAPI_MakeFace_15(myWireProfile, false);
        var aPrismVec = new openCascade.gp_Vec_4(0, 0, myHeight);
        var myBody = new openCascade.BRepPrimAPI_MakePrism_1(myFaceProfile.Face(), aPrismVec, false, true);
        // Body : Apply Fillets
        var mkFillet = new openCascade.BRepFilletAPI_MakeFillet(myBody.Shape(), openCascade.ChFi3d_FilletShape.ChFi3d_Rational);
        var anEdgeExplorer = new openCascade.TopExp_Explorer_2(myBody.Shape(), openCascade.TopAbs_ShapeEnum.TopAbs_EDGE, openCascade.TopAbs_ShapeEnum.TopAbs_SHAPE);
        while (anEdgeExplorer.More()) {
            var anEdge = openCascade.TopoDS.Edge_1(anEdgeExplorer.Current());
            // Add edge to fillet algorithm
            mkFillet.Add_2(myThickness / 12., anEdge);
            anEdgeExplorer.Next();
        }
        myBody = mkFillet.Shape();
        // Body : Add the Neck
        var neckLocation = new openCascade.gp_Pnt_3(0, 0, myHeight);
        var neckAxis = openCascade.gp.DZ();
        var neckAx2 = new openCascade.gp_Ax2_3(neckLocation, neckAxis);
        var myNeckRadius = myThickness / 4.;
        var myNeckHeight = myHeight / 10.;
        var MKCylinder = new openCascade.BRepPrimAPI_MakeCylinder_3(neckAx2, myNeckRadius, myNeckHeight);
        var myNeck = MKCylinder.Shape();
        myBody = new openCascade.BRepAlgoAPI_Fuse_3(myBody, myNeck, new openCascade.Message_ProgressRange_1());
        // Body : Create a Hollowed Solid
        var faceToRemove;
        var zMax = -1;
        var aFaceExplorer = new openCascade.TopExp_Explorer_2(myBody.Shape(), openCascade.TopAbs_ShapeEnum.TopAbs_FACE, openCascade.TopAbs_ShapeEnum.TopAbs_SHAPE);
        for (; aFaceExplorer.More(); aFaceExplorer.Next()) {
            var aFace = openCascade.TopoDS.Face_1(aFaceExplorer.Current());
            // Check if <aFace> is the top face of the bottle's neck 
            var aSurface = openCascade.BRep_Tool.Surface_2(aFace);
            if (aSurface.get().$$.ptrType.name === "Geom_Plane*") {
                var aPlane = new openCascade.Handle_Geom_Plane_2(aSurface.get()).get();
                var aPnt_1 = aPlane.Location();
                var aZ = aPnt_1.Z();
                if (aZ > zMax) {
                    zMax = aZ;
                    faceToRemove = new openCascade.TopExp_Explorer_2(aFace, openCascade.TopAbs_ShapeEnum.TopAbs_FACE, openCascade.TopAbs_ShapeEnum.TopAbs_SHAPE).Current();
                }
            }
        }
        var facesToRemove = new openCascade.TopTools_ListOfShape_1();
        facesToRemove.Append_1(faceToRemove);
        var s = myBody.Shape();
        myBody = new openCascade.BRepOffsetAPI_MakeThickSolid();
        myBody.MakeThickSolidByJoin(s, facesToRemove, -myThickness / 50, 1.e-3, openCascade.BRepOffset_Mode.BRepOffset_Skin, false, false, openCascade.GeomAbs_JoinType.GeomAbs_Arc, false, new openCascade.Message_ProgressRange_1());
        // Threading : Create Surfaces
        var aCyl1 = new openCascade.Geom_CylindricalSurface_1(new openCascade.gp_Ax3_2(neckAx2), myNeckRadius * 0.99);
        var aCyl2 = new openCascade.Geom_CylindricalSurface_1(new openCascade.gp_Ax3_2(neckAx2), myNeckRadius * 1.05);
        // Threading : Define 2D Curves
        var aPnt = new openCascade.gp_Pnt2d_3(2. * Math.PI, myNeckHeight / 2.);
        var aDir = new openCascade.gp_Dir2d_4(2. * Math.PI, myNeckHeight / 4.);
        var anAx2d = new openCascade.gp_Ax2d_2(aPnt, aDir);
        var aMajor = 2. * Math.PI;
        var aMinor = myNeckHeight / 10;
        var anEllipse1 = new openCascade.Geom2d_Ellipse_2(anAx2d, aMajor, aMinor, true);
        var anEllipse2 = new openCascade.Geom2d_Ellipse_2(anAx2d, aMajor, aMinor / 4, true);
        var anArc1 = new openCascade.Geom2d_TrimmedCurve(new openCascade.Handle_Geom2d_Curve_2(anEllipse1), 0, Math.PI, true, true);
        var anArc2 = new openCascade.Geom2d_TrimmedCurve(new openCascade.Handle_Geom2d_Curve_2(anEllipse2), 0, Math.PI, true, true);
        var tmp1 = anEllipse1.Value(0);
        var anEllipsePnt1 = new openCascade.gp_Pnt2d_3(tmp1.X(), tmp1.Y());
        var tmp2 = anEllipse1.Value(Math.PI);
        var anEllipsePnt2 = new openCascade.gp_Pnt2d_3(tmp2.X(), tmp2.Y());
        var aSegment = new openCascade.GCE2d_MakeSegment_1(anEllipsePnt1, anEllipsePnt2);
        // Threading : Build Edges and Wires
        var anEdge1OnSurf1 = new openCascade.BRepBuilderAPI_MakeEdge_30(new openCascade.Handle_Geom2d_Curve_2(anArc1), new openCascade.Handle_Geom_Surface_2(aCyl1));
        var anEdge2OnSurf1 = new openCascade.BRepBuilderAPI_MakeEdge_30(new openCascade.Handle_Geom2d_Curve_2(aSegment.Value().get()), new openCascade.Handle_Geom_Surface_2(aCyl1));
        var anEdge1OnSurf2 = new openCascade.BRepBuilderAPI_MakeEdge_30(new openCascade.Handle_Geom2d_Curve_2(anArc2), new openCascade.Handle_Geom_Surface_2(aCyl2));
        var anEdge2OnSurf2 = new openCascade.BRepBuilderAPI_MakeEdge_30(new openCascade.Handle_Geom2d_Curve_2(aSegment.Value().get()), new openCascade.Handle_Geom_Surface_2(aCyl2));
        var threadingWire1 = new openCascade.BRepBuilderAPI_MakeWire_3(anEdge1OnSurf1.Edge(), anEdge2OnSurf1.Edge());
        var threadingWire2 = new openCascade.BRepBuilderAPI_MakeWire_3(anEdge1OnSurf2.Edge(), anEdge2OnSurf2.Edge());
        openCascade.BRepLib.BuildCurves3d_2(threadingWire1.Wire());
        openCascade.BRepLib.BuildCurves3d_2(threadingWire2.Wire());
        openCascade.BRepLib.BuildCurves3d_2(threadingWire1.Wire());
        openCascade.BRepLib.BuildCurves3d_2(threadingWire2.Wire());
        // Create Threading 
        var aTool = new openCascade.BRepOffsetAPI_ThruSections(true, false, 1.0e-06);
        aTool.AddWire(threadingWire1.Wire());
        aTool.AddWire(threadingWire2.Wire());
        aTool.CheckCompatibility(false);
        var myThreading = aTool.Shape();
        // Building the Resulting Compound 
        var aRes = new openCascade.TopoDS_Compound();
        var aBuilder = new openCascade.BRep_Builder();
        aBuilder.MakeCompound(aRes);
        aBuilder.Add(aRes, myBody.Shape());
        aBuilder.Add(aRes, myThreading);
        return aRes;
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (geometry);


/***/ }),

/***/ "./src/common/math.js":
/*!****************************!*\
  !*** ./src/common/math.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var math = {
    PIPer180: Math.PI / 180,
    kEpsilon: 1e-05,
    degToRad: function (deg) {
        return deg * this.PIPer180;
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (math);


/***/ }),

/***/ "./src/common/openCascadeHelper.js":
/*!*****************************************!*\
  !*** ./src/common/openCascadeHelper.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var openCascadeHelper = {
    setOpenCascade: function (openCascade) {
        this.openCascade = openCascade;
    },
    ForEachFace: function (shape, callback) {
        var oc = this.openCascade;
        var face_index = 0;
        var anExplorer = new oc.TopExp_Explorer_1();
        for (anExplorer.Init(shape, oc.TopAbs_ShapeEnum.TopAbs_FACE, oc.TopAbs_ShapeEnum.TopAbs_SHAPE); anExplorer.More(); anExplorer.Next()) {
            var face = new oc.TopoDS.Face_1(anExplorer.Current());
            callback(face_index++, face);
            face.delete();
        }
        anExplorer.delete();
    },
    ListFaces: function (shape) {
        var oc = this.openCascade;
        var faces = [];
        var anExplorer = new oc.TopExp_Explorer_1();
        for (anExplorer.Init(shape, oc.TopAbs_ShapeEnum.TopAbs_FACE, oc.TopAbs_ShapeEnum.TopAbs_SHAPE); anExplorer.More(); anExplorer.Next()) {
            var face = new oc.TopoDS.Face_1(anExplorer.Current());
            faces.push(face);
        }
        anExplorer.delete();
        return faces;
    },
    ForEachEdge: function (shape, callback) {
        var oc = this.openCascade;
        var edgeHashes = {};
        var edgeIndex = 0;
        var anExplorer = new oc.TopExp_Explorer_1();
        for (anExplorer.Init(shape, oc.TopAbs_ShapeEnum.TopAbs_EDGE, oc.TopAbs_ShapeEnum.TopAbs_SHAPE); anExplorer.More(); anExplorer.Next()) {
            // let edge = anExplorer.Current();
            var edge = new oc.TopoDS.Edge_1(anExplorer.Current());
            var edgeHash = edge.HashCode(100000000);
            if (!edgeHashes.hasOwnProperty(edgeHash)) {
                edgeHashes[edgeHash] = edgeIndex;
                callback(edgeIndex++, edge);
            }
        }
        return edgeHashes;
    },
    tessellate: function (shape, theLinDeflection, theAngDeflection) {
        theLinDeflection = theLinDeflection !== null && theLinDeflection !== void 0 ? theLinDeflection : 0.1;
        theAngDeflection = theAngDeflection !== null && theAngDeflection !== void 0 ? theAngDeflection : 0.5;
        var facelist = [];
        new this.openCascade.BRepMesh_IncrementalMesh_2(shape, theLinDeflection, false, theAngDeflection, false);
        // new this.openCascade.BRepMesh_IncrementalMesh_2(shape, 0.05, false, 0.25, false);
        // new this.openCascade.BRepMesh_IncrementalMesh_2(shape, 0.1, false, 0.5, false);
        // new this.openCascade.BRepMesh_IncrementalMesh_2(shape, 0.5, false, 1, false);
        // new this.openCascade.BRepMesh_IncrementalMesh_2(shape, 1, false, 1.5, false);
        // new this.openCascade.BRepMesh_IncrementalMesh_2(shape, 2, false, 2.5, false);
        // new this.openCascade.BRepMesh_IncrementalMesh_2(shape, 5, false, 5.5, false);
        // new this.openCascade.BRepMesh_IncrementalMesh_2(shape, 10, false, 10.5, false);
        var ExpFace = new this.openCascade.TopExp_Explorer_1();
        var _loop_1 = function () {
            var myFace = this_1.openCascade.TopoDS.Face_1(ExpFace.Current());
            var aFaceLocation = new this_1.openCascade.TopLoc_Location_1();
            var myT = this_1.openCascade.BRep_Tool.Triangulation(myFace, aFaceLocation, 0 /* == Poly_MeshPurpose_NONE */);
            if (myT.IsNull()) {
                return "continue";
            }
            var this_face = {
                vertex_coord: null,
                tri_indexes: [],
                number_of_triangles: 0,
            };
            var triangulation = myT.get();
            // write vertex buffer
            this_face.vertex_coord = new Array(triangulation.NbNodes() * 3);
            var nbNodes = triangulation.NbNodes();
            this_face.vertex_coord = new Array(nbNodes * 3);
            for (var i = 1; i <= nbNodes; i++) {
                var p = triangulation.Node(i).Transformed(aFaceLocation.Transformation());
                // this_face.vertex_coord[((i - 1) * 3) + 0] = p.X().toFixed(3);
                // this_face.vertex_coord[((i - 1) * 3) + 1] = p.Y().toFixed(3);
                // this_face.vertex_coord[((i - 1) * 3) + 2] = p.Z().toFixed(3);
                var ii = ((i - 1) * 3);
                this_face.vertex_coord[ii + 0] = p.X();
                this_face.vertex_coord[ii + 1] = p.Y();
                this_face.vertex_coord[ii + 2] = p.Z();
            }
            // write triangle buffer
            var orient = myFace.Orientation_1();
            var triangles = myT.get().Triangles();
            var trianglesLength = triangles.Length();
            this_face.tri_indexes = new Array(trianglesLength * 3);
            var validFaceTriCount = 0;
            var nbTriangles = myT.get().NbTriangles();
            for (var nt = 1; nt <= nbTriangles; nt++) {
                var t = triangles.Value(nt);
                var n1 = t.Value(1);
                var n2 = t.Value(2);
                var n3 = t.Value(3);
                if (orient !== this_1.openCascade.TopAbs_Orientation.TopAbs_FORWARD) {
                    var tmp = n1;
                    n1 = n2;
                    n2 = tmp;
                }
                var ntt = (validFaceTriCount * 3);
                this_face.tri_indexes[ntt + 0] = n1;
                this_face.tri_indexes[ntt + 1] = n2;
                this_face.tri_indexes[ntt + 2] = n3;
                validFaceTriCount++;
            }
            this_face.number_of_triangles = validFaceTriCount;
            facelist.push(this_face);
            this_face.edgeList = [];
            var oc = this_1.openCascade;
            this_1.ForEachEdge(myFace, function (index, myEdge) {
                var this_edge = {
                    vertex_coord: [],
                    edge_index: -1
                };
                var myP = oc.BRep_Tool.PolygonOnTriangulation_1(myEdge, myT, aFaceLocation);
                var edgeNodes = myP.get().Nodes();
                this_edge.vertex_coord = new Array(edgeNodes.Length() * 3);
                for (var j = 0; j < edgeNodes.Length(); j++) {
                    var vertexIndex = edgeNodes.Value(j + 1);
                    this_edge.vertex_coord[(j * 3) + 0] = this_face.vertex_coord[((vertexIndex - 1) * 3) + 0];
                    this_edge.vertex_coord[(j * 3) + 1] = this_face.vertex_coord[((vertexIndex - 1) * 3) + 1];
                    this_edge.vertex_coord[(j * 3) + 2] = this_face.vertex_coord[((vertexIndex - 1) * 3) + 2];
                }
                this_edge.vertexCount = edgeNodes.Length();
                this_edge.edge_index = index;
                this_edge.cmon = "okok";
                this_face.edgeList.push(this_edge);
            });
        };
        var this_1 = this;
        for (ExpFace.Init(shape, this.openCascade.TopAbs_ShapeEnum.TopAbs_FACE, this.openCascade.TopAbs_ShapeEnum.TopAbs_SHAPE); ExpFace.More(); ExpFace.Next()) {
            _loop_1();
        }
        return facelist;
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (openCascadeHelper);


/***/ }),

/***/ "./src/common/performer.js":
/*!*********************************!*\
  !*** ./src/common/performer.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Performer_lastMeasureMs;
var Performer = /** @class */ (function () {
    function Performer() {
        _Performer_lastMeasureMs.set(this, void 0);
        this.timeStart = 0;
    }
    Performer.create = function () {
        return new Performer();
    };
    Performer.prototype.start = function () {
        this.timeStart = new Date().getTime();
        return this;
    };
    Performer.prototype.measure = function (label) {
        var timeEndLayout = new Date().getTime();
        var durationInMs = (timeEndLayout - this.timeStart);
        // console.log("#perf# "+label +" "+ durationInMs +" ms.")
        __classPrivateFieldSet(this, _Performer_lastMeasureMs, durationInMs, "f");
        return durationInMs;
    };
    Performer.prototype.lastMeasure = function () {
        return __classPrivateFieldGet(this, _Performer_lastMeasureMs, "f");
    };
    return Performer;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Performer);
_Performer_lastMeasureMs = new WeakMap();


/***/ }),

/***/ "./src/common/utils.js":
/*!*****************************!*\
  !*** ./src/common/utils.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Some utils taken directly from CascadeStudio's CascadeStudioStandardUtils.js
 */
var utils = {
    setOpenCascade: function (openCascade) {
        this.openCascade = openCascade;
    },
    /** Converts either single dimensional array or a gp_Pnt to a gp_Pnt.  Does not accept `TopoDS_Vertex`'s yet!
     *
     * @param pnt [x, y, z]
     * @return gp_Pnt point
     */
    convertTo_gp_Pnt: function (pnt) {
        var oc = this.openCascade;
        var point = pnt; // Accept raw gp_Points if we got 'em
        if (point.length) // point is an js array
         {
            point = new oc.gp_Pnt_3(point[0], point[1], (point[2]) ? point[2] : 0);
        }
        return point;
    },
    /** This function converts either single dimensional
     * array or a gp_Pnt to a gp_Pnt.  Does not accept
     * `TopoDS_Vertex`'s yet!
     *
     * @param dir [x, y, z]
     * @return gp_Dir direction
     */
    convertTo_gp_Dir: function (dir) {
        var oc = this.openCascade;
        var direction = dir; // Accept raw gp_Points if we got 'em
        if (direction.length) // direction is an js array
         {
            direction = new oc.gp_Dir_4(direction[0], direction[1], (direction[2]) ? direction[2] : 0);
        }
        return direction;
    },
    parseJoinType: function (joinType) {
        var oc = this.openCascade;
        if (joinType === "Arc")
            return oc.GeomAbs_JoinType.GeomAbs_Arc;
        if (joinType === "Tangent")
            return oc.GeomAbs_JoinType.GeomAbs_Tangent;
        if (joinType === "Intersection")
            return oc.GeomAbs_JoinType.GeomAbs_Intersection;
        throw new Error("Unsupported joint type: " + joinType);
    },
    /**
     *
     * @param points Array of points [ [x,y,z], [x2, y2, z2], ... ]
     */
    convertTo_TColgp_Array1OfPnt: function (points) {
        var oc = this.openCascade;
        var controlPoints = new oc.TColgp_Array1OfPnt_2(1, points.length);
        for (var i = 1; i <= points.length; i++) {
            var pnt = this.convertTo_gp_Pnt(points[i - 1]);
            controlPoints.SetValue(i, pnt);
        }
        return controlPoints;
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (utils);


/***/ }),

/***/ "./src/common/vectors.js":
/*!*******************************!*\
  !*** ./src/common/vectors.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math */ "./src/common/math.js");

var vectors = {
    setOpenCascade: function (openCascade) {
        this.oc = openCascade;
    },
    toString: function (v) {
        return "[x:".concat(v.X(), ",y:").concat(v.Y(), ",z:").concat(v.z(), "]");
    },
    /**
     *
     * @param v [x,y,z]
     * @param t [x,y,z]
     * @return translated [x,y,z]
     */
    translate: function (v, t) {
        return [
            v[0] + t[0],
            v[1] + t[1],
            v[2] + t[2]
        ];
    },
    /**
     *
     * @param v [x,y,z] to be scaled
     * @param s [x,y,z] scale factors
     * @return [x,y,z] scaled v
     */
    scale: function (v, s) {
        return [
            v[0] * s[0],
            v[1] * s[1],
            v[2] * s[2]
        ];
    },
    /**
     * Rotates point v around origin point about given axis and angle in radians.
     * @param v [x,y,z]
     * @param axis [x,y,z]
     * @param angleRad
     */
    rotate: function (v, axis, angleRad) {
        return this.rotateAround(v, [0, 0, 0], axis, angleRad);
    },
    /**
     * Rotates point v around axis in space with given angle in radians.
     * @param v Point to rotate
     * @param axisPoint axis hooking point
     * @param axisDir axis direction
     * @param angleRad angle to rotate
     */
    rotateAround: function (v, axisPoint, axisDir, angleRad) {
        // const zAxisVec = new oc.gp_Vec_4(0,0,1);
        // const zAngleRad = math.degToRad(planeRotationZ);
        // let rotateZ = new oc.gp_Quaternion_5(zAxisVec, zAngleRad);
        var ax1_dir = new this.oc.gp_Dir_4(axisDir[0], axisDir[1], axisDir[2]);
        var ax1_point = new this.oc.gp_Pnt_3(axisPoint[0], axisPoint[1], axisPoint[2]);
        var ax1 = new this.oc.gp_Ax1_2(ax1_point, ax1_dir);
        var p = new this.oc.gp_Pnt_3(v[0], v[1], v[2]);
        p.Rotate(ax1, angleRad);
        return [p.X(), p.Y(), p.Z()];
    },
    /**
     * Calculated vector perpendicular to given input vector p.
     * @param p gp_Vec
     */
    getPerpendicularVector: function (p) {
        var perp = null;
        if (Math.abs(p.x) >= _math__WEBPACK_IMPORTED_MODULE_0__["default"].kEpsilon) {
            var x = -(p.y + p.z) / p.x;
            perp = new this.oc.gp_Vec_4(x, 1, 1);
        }
        if (Math.abs(p.y) >= _math__WEBPACK_IMPORTED_MODULE_0__["default"].kEpsilon) {
            var y = -(p.x + p.z) / p.y;
            perp = new this.oc.gp_Vec_4(1, y, 1);
        }
        if (Math.abs(p.z) >= _math__WEBPACK_IMPORTED_MODULE_0__["default"].kEpsilon) {
            var z = -(p.x + p.y) / p.z;
            perp = new this.oc.gp_Vec_4(1, 1, z);
        }
        if (perp !== null) {
            return perp;
        }
        throw new Error("Cannot find perpendicular vector to (zero vector?) " + this.toString(p));
    },
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (vectors);


/***/ }),

/***/ "./src/common/visualize.js":
/*!*********************************!*\
  !*** ./src/common/visualize.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _openCascadeHelper_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./openCascadeHelper.js */ "./src/common/openCascadeHelper.js");

var visualize = {
    setOpenCascade: function (openCascade) {
        this.openCascade = openCascade;
    },
    //
    // ShapeToMesh(shape, maxDeviation, theAngleDeviation) {
    //   const oc = this.openCascade;
    //  
    //   let fullShapeEdgeHashes = {}; let fullShapeFaceHashes = {};
    //  
    //   let facelist = [], edgeList = [];
    //   try {
    //     // Set up the Incremental Mesh builder, with a precision
    //     new oc.BRepMesh_IncrementalMesh_2(shape, maxDeviation, false, theAngleDeviation, false);
    //     // new this.openCascade.BRepMesh_IncrementalMesh_2(shape, 0.1, false, 0.5, false);
    //
    //     // Construct the edge hashes to assign proper indices to the edges
    //     let fullShapeEdgeHashes2 = {};
    //
    //     // Iterate through the faces and triangulate each one
    //     let triangulations = []; let uv_boxes = []; let curFace = 0;
    //
    //     och.ForEachFace(shape, (faceIndex, myFace) =>
    //     {
    //       var aLocation = new oc.TopLoc_Location_1();
    //       var myT = oc.BRep_Tool.Triangulation(myFace, aLocation, 0);
    //      
    //       if (myT.IsNull()) {
    //         console.error("Encountered Null Face!");
    //         return;
    //       }
    //
    //       let this_face = {
    //         vertex_coord: [],
    //         vertexCount: -1,
    //         uv_coord: [],
    //         tri_indexes: [],
    //         tri_indexesCount: 0,
    //         number_of_triangles: 0,
    //         face_index: fullShapeFaceHashes[myFace.HashCode(100000000)]
    //       };
    //
    //       let pc = new oc.Poly_Connect_2(myT);
    //      
    //       // let Nodes = myT.get().Nodes();
    //       let Nodes = new oc.TColgp_Array1OfPnt_2(1, myT.get().NbNodes());
    //       for (let i = 1; i <= myT.get().NbNodes(); i++)
    //       {
    //         Nodes.SetValue(i, myT.get().Node(i));
    //       }
    //
    //       this_face.vertex_coord = new Array(Nodes.Length());
    //       for(let i = 0; i < Nodes.Length(); i++) {
    //         let p = Nodes.Value(i + 1).Transformed(aLocation.Transformation());
    //
    //         let v = {
    //           x: p.X(),
    //           y: p.Y(),
    //           z: p.Z()
    //         };
    //
    //         this_face.vertex_coord[i] = v;
    //       }
    //      
    //       this_face.vertexCount = Nodes.Length();
    //       this_face.number_of_triangles = validFaceTriCount;
    //       facelist.push(this_face);
    //       curFace += 1;
    //      
    //       try {
    //         och.ForEachEdge(myFace, (index, myEdge) => {
    //
    //           let edgeHash = myEdge.HashCode(100000000);
    //           if (fullShapeEdgeHashes2.hasOwnProperty(edgeHash)) {
    //             let this_edge = {
    //               vertex_coord: [],
    //               edge_index: -1
    //             };
    //
    //             let myP = oc.BRep_Tool.PolygonOnTriangulation_1(myEdge, myT, aLocation);
    //             let edgeNodes = myP.get().Nodes();
    //
    //             this_edge.vertex_coord = new Array(edgeNodes.Length());
    //             for(let j = 0; j < edgeNodes.Length(); j++) {
    //               let vertexIndex = edgeNodes.Value(j+1);
    //              
    //               this_edge.vertex_coord[j] = this_face.vertex_coord[vertexIndex-1];
    //             }
    //
    //             this_edge.vertexCount = edgeNodes.Length();
    //             this_edge.edge_index = index;
    //             this_edge.cmon = "okok";
    //             edgeList.push(this_edge);
    //            
    //           } else {
    //             fullShapeEdgeHashes2[edgeHash] = edgeHash;
    //           }
    //         });
    //       }
    //       catch (e)
    //       {
    //         console.error("error tesselating edges: ",e.message);
    //       }
    //      
    //       triangulations.push(myT);
    //     });
    //
    //     // Get the free edges that aren't on any triangulated face/surface
    //     och.ForEachEdge(shape, (index, myEdge) => {
    //       let edgeHash = myEdge.HashCode(100000000);
    //       if (!fullShapeEdgeHashes2.hasOwnProperty(edgeHash)) {
    //         let this_edge = {
    //           vertex_coord: [],
    //           edge_index: -1
    //         };
    //
    //         let aLocation = new oc.TopLoc_Location_1();
    //         let adaptorCurve = new oc.BRepAdaptor_Curve_2(myEdge);
    //         let tangDef = new oc.GCPnts_TangentialDeflection_2(adaptorCurve, maxDeviation, 0.1, 2, 1.0e-9, 1.0e-7);
    //
    //         // write vertex buffer
    //         this_edge.vertex_coord = new Array(tangDef.NbPoints());
    //         for(let j = 0; j < tangDef.NbPoints(); j++) {
    //           let vertex = tangDef.Value(j+1).Transformed(aLocation.Transformation());
    //           this_edge.vertex_coord[j] = { x: vertex.X(), y: vertex.Y(), z:vertex.Z() };
    //         }
    //
    //         this_edge.edge_index = fullShapeEdgeHashes[edgeHash];
    //         fullShapeEdgeHashes2[edgeHash] = edgeHash;
    //        
    //         edgeList.push(this_edge);
    //       }
    //     });
    //
    //   } catch(err) {
    //     console.error("error: ",err.message)
    //     throw err;
    //   }
    //
    //   return [facelist, edgeList, {cmon: "ok"}];
    // },
    ShapeToEdges: function (shape, theLinDeflection, theAngDeflection) {
        var oc = this.openCascade;
        theLinDeflection = theLinDeflection !== null && theLinDeflection !== void 0 ? theLinDeflection : 0.1;
        var fullShapeEdgeHashes = {};
        var fullShapeFaceHashes = {};
        var edgeList = [];
        try {
            // Set up the Incremental Mesh builder, with a precision
            new oc.BRepMesh_IncrementalMesh_2(shape, theLinDeflection, false, theAngDeflection, false);
            // Get the free edges that aren't on any triangulated face/surface
            _openCascadeHelper_js__WEBPACK_IMPORTED_MODULE_0__["default"].ForEachEdge(shape, function (index, myEdge) {
                var edgeHash = myEdge.HashCode(100000000);
                if (!fullShapeEdgeHashes.hasOwnProperty(edgeHash)) {
                    var this_edge = {
                        vertex_coord: [],
                        edge_index: -1
                    };
                    var aLocation = new oc.TopLoc_Location_1();
                    var adaptorCurve = new oc.BRepAdaptor_Curve_2(myEdge);
                    var tangDef = new oc.GCPnts_TangentialDeflection_2(adaptorCurve, theLinDeflection, theAngDeflection, 2, 1.0e-9, 1.0e-7);
                    // write vertex buffer
                    this_edge.vertex_coord = new Array(tangDef.NbPoints());
                    for (var j = 0; j < tangDef.NbPoints(); j++) {
                        var vertex = tangDef.Value(j + 1).Transformed(aLocation.Transformation());
                        this_edge.vertex_coord[j] = { x: vertex.X(), y: vertex.Y(), z: vertex.Z() };
                    }
                    this_edge.edge_index = fullShapeEdgeHashes[edgeHash];
                    fullShapeEdgeHashes[edgeHash] = edgeHash;
                    edgeList.push(this_edge);
                }
            });
        }
        catch (err) {
            console.error("error: ", err.message);
            throw err;
        }
        return { edgeList: edgeList };
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (visualize);


/***/ }),

/***/ "./src/common/wireToSolid.js":
/*!***********************************!*\
  !*** ./src/common/wireToSolid.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math */ "./src/common/math.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/common/utils.js");
/* harmony import */ var _occt_shapes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../occt/shapes */ "./src/occt/shapes.js");
/* harmony import */ var _compounds__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./compounds */ "./src/common/compounds.ts");
/* harmony import */ var _occt_faces__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../occt/faces */ "./src/occt/faces.ts");





var wireToSolid = {
    setOpenCascade: function (openCascade) {
        this.openCascade = openCascade;
    },
    /**
     *
     * @param wireShape Wire shape
     * @param axisPoint [x, y, z]
     * @param axisDirection [x, y, z]
     * @param angleDeg angle in degrees
     */
    revolveWireToMakeSolid: function (wireShape, axisPoint, axisDirection, angleDeg) {
        var oc = this.openCascade;
        var point = _utils__WEBPACK_IMPORTED_MODULE_1__["default"].convertTo_gp_Pnt(axisPoint);
        var direction = _utils__WEBPACK_IMPORTED_MODULE_1__["default"].convertTo_gp_Dir(axisDirection);
        var axis = new oc.gp_Ax1_2(point, direction);
        var angleRad = _math__WEBPACK_IMPORTED_MODULE_0__["default"].degToRad(angleDeg);
        var profileFace = _occt_faces__WEBPACK_IMPORTED_MODULE_4__["default"].wiresToFaces([wireShape]);
        var revolBuilder = new oc.BRepPrimAPI_MakeRevol_1(profileFace, axis, angleRad, true);
        var solid = revolBuilder.Shape();
        axis.delete();
        profileFace.delete();
        revolBuilder.delete();
        return solid;
        // // console.log("first shape: ", shapes.getShapeTypeAsString(revolBuilder.FirstShape_1()))
        // // console.log("last shape: ", shapes.getShapeTypeAsString(revolBuilder.LastShape_1()))
        //
        // let firstFaceShape = new oc.BRepBuilderAPI_MakeFace_15(revolBuilder.FirstShape_1(), false);
        // let endFaceShape = new oc.BRepBuilderAPI_MakeFace_15(revolBuilder.LastShape_1(), false);
        //
        // let firstFace = compounds.listCompoundShapes(shape);
        //
        // let sewingBuilder = new oc.BRepBuilderAPI_FastSewing(0.01);
        // sewingBuilder.Add_1(shell);
        // sewingBuilder.Add_1(startFace);
        // sewingBuilder.Add_1(endFace);
        // sewingBuilder.Perform();
        //
        // let closedShell = sewingBuilder.GetResult();
        //
        // let solidBuilder = new oc.BRepBuilderAPI_MakeSolid_3(closedShell);
        // let solid = solidBuilder.Solid();
        //
        // return solid;
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (wireToSolid);


/***/ }),

/***/ "./src/common/wires.js":
/*!*****************************!*\
  !*** ./src/common/wires.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/common/utils.js");
/* harmony import */ var _occt_shapes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../occt/shapes */ "./src/occt/shapes.js");
/* harmony import */ var _compounds__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./compounds */ "./src/common/compounds.ts");
/* harmony import */ var _csg_csgTypes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../csg/csgTypes */ "./src/csg/csgTypes.ts");
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};




var wires = {
    setOpenCascade: function (openCascade) {
        this.openCascade = openCascade;
    },
    // export declare type GeomAbs_Shape = {
    //     GeomAbs_C0: {};
    //     GeomAbs_G1: {};
    //     GeomAbs_C1: {};
    //     GeomAbs_G2: {};
    //     GeomAbs_C2: {};
    //     GeomAbs_C3: {};
    //     GeomAbs_CN: {};
    // }
    /**
     * Converts from string into GeomAbs_Shape value.
     * @param continuity string like "C0" or "CN" or "G1"
     */
    parseContinuityAs_GeomAbs_Shape: function (continuity) {
        var oc = this.openCascade;
        var key = "GeomAbs_".concat(continuity);
        return oc.GeomAbs_Shape[key];
    },
    /**
     *
     * @param points An array of [x,y,z] points. [[x,y,z], [x,y,z], [x,y,z], ...]
     * @param closed should close the curve
     */
    makePolygonWireFromPoins: function (points, closed) {
        var oc = this.openCascade;
        points = __spreadArray([], points, true);
        if (closed)
            points.push(points[0]);
        // Create the wire
        var mkWire = new oc.BRepBuilderAPI_MakeWire_1();
        // let wire = new oc.BRepBuilderAPI_MakeWire_2(edge).Wire();
        for (var i = 0; i < points.length - 1; i++) {
            var a = new oc.gp_Pnt_3(points[i][0], points[i][1], points[i][2]);
            var b = new oc.gp_Pnt_3(points[i + 1][0], points[i + 1][1], points[i + 1][2]);
            var edge = new oc.BRepBuilderAPI_MakeEdge_3(a, b).Edge();
            mkWire.Add_1(edge);
        }
        // Create the polygon
        var polygon = mkWire.Wire();
        return polygon;
    },
    /**
     * Taken from OpenCascade
     * TODO: implement this
     * @param points An array of [x,y,z] points. [[x,y,z], [x,y,z], [x,y,z], ...]
     * @param closed should close the curve
     * @param curveContinuity for ex: oc.GeomAbs_Shape.GeomAbs_C0
     */
    fitBSplineWireFromPoints: function (points, closed, curveContinuity) {
        var oc = this.openCascade;
        var ptList = new oc.TColgp_Array1OfPnt_2(1, points.length + (closed ? 1 : 0));
        for (var pIndex = 1; pIndex <= points.length; pIndex++) {
            ptList.SetValue(pIndex, _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].convertTo_gp_Pnt(points[pIndex - 1]));
        }
        if (closed) {
            ptList.SetValue(points.length + 1, ptList.Value(1));
        }
        // let geomCurveHandle = new oc.GeomAPI_PointsToBSpline_2(ptList, 3, 8, oc.GeomAbs_Shape.GeomAbs_C0, 1.0e-3).Curve();
        var geomCurveHandle = new oc.GeomAPI_PointsToBSpline_2(ptList, 3, 8, curveContinuity, 1.0e-3).Curve();
        var geomCurveHandle2 = new oc.Handle_Geom_Curve_2(geomCurveHandle.get());
        var edge = new oc.BRepBuilderAPI_MakeEdge_24(geomCurveHandle2).Edge();
        var wire = new oc.BRepBuilderAPI_MakeWire_2(edge).Wire();
        // // console.log("wire: ",wire)
        return wire;
    },
    /**
     * TODO: implement closing the curve
     * @param points control points of the cubic bezier segment (multiples of 4)
     * @param closed
     * @return {TopoDS_Wire}
     */
    makeBezierWireFromControlPoints: function (points, closed) {
        var oc = this.openCascade;
        var controlPoints = new oc.TColgp_Array1OfPnt_2(1, points.length);
        for (var i = 1; i <= points.length; i++) {
            var pnt = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].convertTo_gp_Pnt(points[i - 1]);
            controlPoints.SetValue(i, pnt);
        }
        var bezierCurve = new oc.Geom_BezierCurve_1(controlPoints);
        var geomCurveHandle2 = new oc.Handle_Geom_Curve_2(bezierCurve);
        var edge = new oc.BRepBuilderAPI_MakeEdge_24(geomCurveHandle2).Edge();
        var wire = new oc.BRepBuilderAPI_MakeWire_2(edge).Wire();
        return wire;
    },
    /**
     *
     * @param svgEdges An array of SVGEdge
     * @param isClosed
     */
    makeBezierFromSVGPath: function (svgEdges, isClosed) {
        var oc = this.openCascade;
        var mkWire = new oc.BRepBuilderAPI_MakeWire_1();
        svgEdges.forEach(function (svgEdge) {
            switch (svgEdge.EdgeType) {
                case _csg_csgTypes__WEBPACK_IMPORTED_MODULE_3__.SVGEdgeType.Line: {
                    var a = new oc.gp_Pnt_3(svgEdge.Points[0][0], svgEdge.Points[0][1], 0);
                    var b = new oc.gp_Pnt_3(svgEdge.Points[1][0], svgEdge.Points[1][1], 0);
                    var edge = new oc.BRepBuilderAPI_MakeEdge_3(a, b).Edge();
                    mkWire.Add_1(edge);
                    break;
                }
                case _csg_csgTypes__WEBPACK_IMPORTED_MODULE_3__.SVGEdgeType.BezierQuadratic:
                case _csg_csgTypes__WEBPACK_IMPORTED_MODULE_3__.SVGEdgeType.BezierCubic: {
                    var controlPoints = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].convertTo_TColgp_Array1OfPnt(svgEdge.Points);
                    var bezierCurve = new oc.Geom_BezierCurve_1(controlPoints);
                    var geomCurveHandle2 = new oc.Handle_Geom_Curve_2(bezierCurve);
                    var edge = new oc.BRepBuilderAPI_MakeEdge_24(geomCurveHandle2).Edge();
                    mkWire.Add_1(edge);
                    break;
                }
            }
        });
        var svgPathWire = mkWire.Wire();
        return svgPathWire;
    },
    /**
     *
     * @param svgPaths [ [svgPath], ...]
     */
    makeSVGPathsWire: function (svgPaths) {
        var _this = this;
        var wires = [];
        svgPaths.forEach(function (svgPath) {
            try {
                var wire = _this.makeBezierFromSVGPath(svgPath.Edges, svgPath.IsClosed);
                wires.push(wire);
            }
            catch (error) {
                console.error("error while making svg path wire: ", error);
            }
        });
        // console.log("wires: ",wires)
        var compound = _compounds__WEBPACK_IMPORTED_MODULE_2__["default"].makeCompound(wires);
        return compound;
    },
    /**
     * GeomAPI_Interpolate_2 DOES NOT WORK YET as occt.js is missing bindings to create the TColgp_HArray1OfPnt array of points, for details
     * see this https://github.com/donalffons/opencascade.js/issues/87
     * and this https://github.com/donalffons/opencascade.js/issues/33
     * @param points
     * @param closed
     * @return {TopoDS_Wire}
     */
    fitBezierWireFromPoints: function (points, closed) {
        var oc = this.openCascade;
        var controlPoints = new oc.TColgp_Array1OfPnt_2(1, points.length);
        for (var i = 1; i <= points.length; i++) {
            var pnt = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].convertTo_gp_Pnt(points[i - 1]);
            controlPoints.SetValue(i, pnt);
        }
        var parameters = new oc.TColStd_Array1OfReal_2(1, points.length);
        var step = 1.0 / (points.length - 1);
        for (var i = 0; i < points.length; i++) {
            parameters.SetValue(i + 1, i * step);
        }
        var controlPointsHandle = new oc.Handle_TColgp_HArray1OfPnt_2(controlPoints);
        var interp = new oc.GeomAPI_Interpolate_2(controlPointsHandle, parameters, false, 1.0e-6);
        var bezierCurve = interp.Curve();
        var geomCurveHandle2 = new oc.Handle_Geom_Curve_2(bezierCurve);
        var edge = new oc.BRepBuilderAPI_MakeEdge_24(geomCurveHandle2).Edge();
        var wire = new oc.BRepBuilderAPI_MakeWire_2(edge).Wire();
        return wire;
    },
    projectWireOntoFace: function (wire, target, d) {
        var oc = this.openCascade;
        var dir = new oc.gp_Dir_4(d[0], d[1], d[2]);
        var projection = new oc.BRepProj_Projection_1(wire, target, dir);
        // projection.Build();
        if (!projection.IsDone()) {
            throw new Error("Projecting a wire onto a shape failed.");
        }
        var projectedWire = projection.Shape();
        return projectedWire;
        // let projectedWire = new oc.TopoDS.Wire_1(projection.Shape());
        // TopoDS_Wire projectedWire = TopoDS::Wire();
        // use the projected wire
    },
    // offsetWire(wireShape, offset, joinType) {
    //     const oc = this.openCascade;
    //
    //     joinType = _utils.parseJoinType(joinType);
    //    
    //     wireShape = compounds.listWiresInsideCompound(wireShape)[0];
    //     let wire = new oc.TopoDS.Wire_1(wireShape);
    //
    //     let offseter = new oc.BRepOffsetAPI_MakeOffset_3(wire, joinType, false);
    //     offseter.Perform(offset, 0);
    //    
    //     if (!offseter.IsDone()) {
    //         throw new Error("Offsetting a wire failed.");
    //     }
    //
    //     let offsetedWire = offseter.Shape();
    //     return offsetedWire; 
    // },
    offsetWire: function (wireShape, offset, joinType) {
        var oc = this.openCascade;
        joinType = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].parseJoinType(joinType);
        var offsetedWires = [];
        _compounds__WEBPACK_IMPORTED_MODULE_2__["default"].listWiresInsideCompound(wireShape).forEach(function (wireShape) {
            var wire = new oc.TopoDS.Wire_1(wireShape);
            var offseter = new oc.BRepOffsetAPI_MakeOffset_3(wire, joinType, false);
            offseter.Perform(offset, 0);
            if (!offseter.IsDone()) {
                throw new Error("Offsetting a wire failed.");
            }
            var offsetedWire = offseter.Shape();
            offsetedWires.push(offsetedWire);
        });
        if (offsetedWires.length === 1) {
            return offsetedWires[0];
        }
        return _compounds__WEBPACK_IMPORTED_MODULE_2__["default"].makeCompound(offsetedWires);
    },
    /**
     *
     * @param wiresShape A compound of wires.
     */
    reconstructWires: function (wireShapes) {
        wireShapes = wireShapes.map(function (wireShape) { return _occt_shapes__WEBPACK_IMPORTED_MODULE_1__["default"].listWiresInsideCompound(wireShape); }).flat(1);
        var edges = [];
        wireShapes.forEach(function (wireShape) {
            openCascadeHelper.ForEachEdge(wireShape, function (index, edge) {
                edges.push(edge);
                // console.log("### adding edge: ",edge);
                // console.log("### adding edge: of type: ", shapes.getShapeTypeAsString(edge));
            });
        });
        var edgesCompound = _compounds__WEBPACK_IMPORTED_MODULE_2__["default"].makeCompound(edges);
        var wiresCompound = new oc.TopoDS_Wire();
        var wireDone = oc.BOPAlgo_Tools.EdgesToWires(edgesCompound, wiresCompound, false, .001);
        // console.log("### wiresToFaces wireDone is: ",wireDone);
        // console.log("### wiresToFaces wiresCompound is: ",wiresCompound);
        return wiresCompound;
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (wires);


/***/ }),

/***/ "./src/csg/csgCompoundFactory.js":
/*!***************************************!*\
  !*** ./src/csg/csgCompoundFactory.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _csgTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./csgTypes */ "./src/csg/csgTypes.ts");
/* harmony import */ var _occt_occtio__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../occt/occtio */ "./src/occt/occtio.ts");
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CSGCompoundFactory_instances, _CSGCompoundFactory_geometry, _CSGCompoundFactory_nodeCalculator, _CSGCompoundFactory_createFromFilE;


var CSGCompoundFactory = /** @class */ (function () {
    function CSGCompoundFactory(geometry, nodeCalculator) {
        _CSGCompoundFactory_instances.add(this);
        _CSGCompoundFactory_geometry.set(this, void 0);
        _CSGCompoundFactory_nodeCalculator.set(this, void 0);
        __classPrivateFieldSet(this, _CSGCompoundFactory_geometry, geometry, "f");
        __classPrivateFieldSet(this, _CSGCompoundFactory_nodeCalculator, nodeCalculator, "f");
    }
    /**
        return: a shape.
     */
    CSGCompoundFactory.prototype.createNodeShape = function (node) {
        if (node.Type !== _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.Compound)
            throw new Error("Given node is not a ".concat(_csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.Compound));
        var shape = undefined;
        switch (node.Compound.Type) {
            case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGCompoundType.FromFile:
                shape = __classPrivateFieldGet(this, _CSGCompoundFactory_instances, "m", _CSGCompoundFactory_createFromFilE).call(this, node.Compound);
                break;
            default:
                throw new Error("Compound type ".concat(node.Compound.Type, " is not supported."));
        }
        return shape;
    };
    return CSGCompoundFactory;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CSGCompoundFactory);
_CSGCompoundFactory_geometry = new WeakMap(), _CSGCompoundFactory_nodeCalculator = new WeakMap(), _CSGCompoundFactory_instances = new WeakSet(), _CSGCompoundFactory_createFromFilE = function _CSGCompoundFactory_createFromFilE(compound) {
    var shape = __classPrivateFieldGet(this, _CSGCompoundFactory_geometry, "f").occtio.textToShape(compound.FileText, compound.FileType);
    return shape;
};


/***/ }),

/***/ "./src/csg/csgFaceFactory.js":
/*!***********************************!*\
  !*** ./src/csg/csgFaceFactory.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _csgTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./csgTypes */ "./src/csg/csgTypes.ts");
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CSGFaceFactory_instances, _CSGFaceFactory_geometry, _CSGFaceFactory_nodeCalculator, _CSGFaceFactory_createFaceFromWires;

var CSGFaceFactory = /** @class */ (function () {
    function CSGFaceFactory(geometry, nodeCalculator) {
        _CSGFaceFactory_instances.add(this);
        _CSGFaceFactory_geometry.set(this, void 0);
        _CSGFaceFactory_nodeCalculator.set(this, void 0);
        __classPrivateFieldSet(this, _CSGFaceFactory_geometry, geometry, "f");
        __classPrivateFieldSet(this, _CSGFaceFactory_nodeCalculator, nodeCalculator, "f");
    }
    /**
        return: a shape.
     */
    CSGFaceFactory.prototype.createNodeShape = function (node) {
        if (node.Type !== _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.Face)
            throw new Error("Given node is not a ".concat(_csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.Face));
        var shape = undefined;
        switch (node.Face.Type) {
            case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGFaceType.FaceFromWires:
                shape = __classPrivateFieldGet(this, _CSGFaceFactory_instances, "m", _CSGFaceFactory_createFaceFromWires).call(this, node.Face.WireNodes);
                break;
            case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGFaceType.SelectFaceFromShapeByAxis:
                break;
            case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGFaceType.SelectFaceByIndex:
                break;
            default:
                throw new Error("Face type ".concat(node.Face.Type, " is not supported."));
        }
        return shape;
    };
    return CSGFaceFactory;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CSGFaceFactory);
_CSGFaceFactory_geometry = new WeakMap(), _CSGFaceFactory_nodeCalculator = new WeakMap(), _CSGFaceFactory_instances = new WeakSet(), _CSGFaceFactory_createFaceFromWires = function _CSGFaceFactory_createFaceFromWires(wireNodes) {
    var _this = this;
    var wireShapes = wireNodes.map(function (wireNode) {
        var wireShape = __classPrivateFieldGet(_this, _CSGFaceFactory_nodeCalculator, "f").calculateNodeShapesWithCache(wireNode)[0];
        return wireShape;
    });
    var face = __classPrivateFieldGet(this, _CSGFaceFactory_geometry, "f").faces.wiresToFaces(wireShapes);
    return face;
};


/***/ }),

/***/ "./src/csg/csgNodeCalculator.js":
/*!**************************************!*\
  !*** ./src/csg/csgNodeCalculator.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _csgTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./csgTypes */ "./src/csg/csgTypes.ts");
/* harmony import */ var _csgSolidFactory_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./csgSolidFactory.js */ "./src/csg/csgSolidFactory.js");
/* harmony import */ var _csgPlaneFactory_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./csgPlaneFactory.js */ "./src/csg/csgPlaneFactory.js");
/* harmony import */ var _csgWireFactory_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./csgWireFactory.js */ "./src/csg/csgWireFactory.js");
/* harmony import */ var _csgWireOperationCalculator_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./csgWireOperationCalculator.js */ "./src/csg/csgWireOperationCalculator.js");
/* harmony import */ var _csgFaceFactory_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./csgFaceFactory.js */ "./src/csg/csgFaceFactory.js");
/* harmony import */ var _csgOperationCalculator_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./csgOperationCalculator.js */ "./src/csg/csgOperationCalculator.js");
/* harmony import */ var _csgTransformCalculator_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./csgTransformCalculator.js */ "./src/csg/csgTransformCalculator.js");
/* harmony import */ var _common_performer__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./../common/performer */ "./src/common/performer.js");
/* harmony import */ var _common_featureFlags__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./../common/featureFlags */ "./src/common/featureFlags.js");
/* harmony import */ var _csgVertexFactory_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./csgVertexFactory.js */ "./src/csg/csgVertexFactory.js");
/* harmony import */ var _csgCompoundFactory__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./csgCompoundFactory */ "./src/csg/csgCompoundFactory.js");
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CSGNodeCalculator_instances, _CSGNodeCalculator_geometry, _CSGNodeCalculator_solidFactory, _CSGNodeCalculator_planeFactory, _CSGNodeCalculator_wireFactory, _CSGNodeCalculator_faceFactory, _CSGNodeCalculator_vertexFactory, _CSGNodeCalculator_compoundFactory, _CSGNodeCalculator_wireOperationCalculator, _CSGNodeCalculator_operationCalculator, _CSGNodeCalculator_transformCalculator, _CSGNodeCalculator_nodeCacheMap, _CSGNodeCalculator_calculateNodeShapes, _CSGNodeCalculator_calculateReferenceNodeShapes, _CSGNodeCalculator_prepareResultMeshForShape;












var CSGNodeCalculator = /** @class */ (function () {
    function CSGNodeCalculator(geometry) {
        _CSGNodeCalculator_instances.add(this);
        _CSGNodeCalculator_geometry.set(this, void 0);
        _CSGNodeCalculator_solidFactory.set(this, void 0);
        _CSGNodeCalculator_planeFactory.set(this, void 0);
        _CSGNodeCalculator_wireFactory.set(this, void 0);
        _CSGNodeCalculator_faceFactory.set(this, void 0);
        _CSGNodeCalculator_vertexFactory.set(this, void 0);
        _CSGNodeCalculator_compoundFactory.set(this, void 0);
        _CSGNodeCalculator_wireOperationCalculator.set(this, void 0);
        _CSGNodeCalculator_operationCalculator.set(this, void 0);
        _CSGNodeCalculator_transformCalculator.set(this, void 0);
        _CSGNodeCalculator_nodeCacheMap.set(this, void 0);
        __classPrivateFieldSet(this, _CSGNodeCalculator_geometry, geometry, "f");
        __classPrivateFieldSet(this, _CSGNodeCalculator_solidFactory, new _csgSolidFactory_js__WEBPACK_IMPORTED_MODULE_1__["default"](geometry, this), "f");
        __classPrivateFieldSet(this, _CSGNodeCalculator_planeFactory, new _csgPlaneFactory_js__WEBPACK_IMPORTED_MODULE_2__["default"](geometry), "f");
        __classPrivateFieldSet(this, _CSGNodeCalculator_wireFactory, new _csgWireFactory_js__WEBPACK_IMPORTED_MODULE_3__["default"](geometry), "f");
        __classPrivateFieldSet(this, _CSGNodeCalculator_faceFactory, new _csgFaceFactory_js__WEBPACK_IMPORTED_MODULE_5__["default"](geometry, this), "f");
        __classPrivateFieldSet(this, _CSGNodeCalculator_vertexFactory, new _csgVertexFactory_js__WEBPACK_IMPORTED_MODULE_10__["default"](geometry, this), "f");
        __classPrivateFieldSet(this, _CSGNodeCalculator_compoundFactory, new _csgCompoundFactory__WEBPACK_IMPORTED_MODULE_11__["default"](geometry, this), "f");
        __classPrivateFieldSet(this, _CSGNodeCalculator_wireOperationCalculator, new _csgWireOperationCalculator_js__WEBPACK_IMPORTED_MODULE_4__["default"](geometry, this), "f");
        __classPrivateFieldSet(this, _CSGNodeCalculator_operationCalculator, new _csgOperationCalculator_js__WEBPACK_IMPORTED_MODULE_6__["default"](geometry, this), "f");
        __classPrivateFieldSet(this, _CSGNodeCalculator_transformCalculator, new _csgTransformCalculator_js__WEBPACK_IMPORTED_MODULE_7__["default"](geometry, this), "f");
        __classPrivateFieldSet(this, _CSGNodeCalculator_nodeCacheMap, new Map(), "f");
    }
    /**
     * Unity's API entry point to calculating CSGNode result.
     *
     * @param node CSGNode input to calculate.
     * @returns {string} A text representation list of topo shapes.
     */
    CSGNodeCalculator.prototype.calculateNodeResult = function (node) {
        // // console.log("######### calculateNodeResult abcdefgh #########")
        var _this = this;
        try {
            var perf = _common_performer__WEBPACK_IMPORTED_MODULE_8__["default"].create().start();
            if (typeof node === 'string') {
                var perfParseJson = _common_performer__WEBPACK_IMPORTED_MODULE_8__["default"].create().start();
                node = JSON.parse(node);
                perfParseJson.measure("calculateNodeResult() parse input node json node Id: " + node.PartName);
            }
            var perfCalculateNodeShape = _common_performer__WEBPACK_IMPORTED_MODULE_8__["default"].create().start();
            var shapes = this.calculateNodeShapesWithCache(node);
            perfCalculateNodeShape.measure("calculateNodeResult() calculate node shapes for node Id: " + node.PartName);
            var topoShapesData_1 = {
                topoShapes: []
            };
            shapes.forEach(function (shape, shapeIndex) {
                _this.appendTopoShapeData(node, shape, topoShapesData_1, shapeIndex);
            });
            perf.measure("calculateNodeResult() node Id: " + node.PartName);
            node._duration = perf.lastMeasure();
            var perfJson = _common_performer__WEBPACK_IMPORTED_MODULE_8__["default"].create().start();
            var topoShapesDataJson = JSON.stringify(topoShapesData_1, null, 2);
            // console.log("C# topoShapesDataJson length: "+topoShapesDataJson.length)
            // console.log("C# typeof topoShapesDataJson: "+ (typeof topoShapesDataJson))
            perfJson.measure("calculateNodeResult() stringify topoShapeDataJson node Id: \"+node.PartName+\"");
            return topoShapesDataJson;
        }
        catch (e) {
            var oc = __classPrivateFieldGet(this, _CSGNodeCalculator_geometry, "f").openCascade;
            var errorMessage = "";
            if (typeof e === "number") {
                var exceptionData = oc.OCJS.getStandard_FailureData(e);
                // console.log(`That didn't work because: ${exceptionData.GetMessageString()}`);
                errorMessage = "That didn't work because: ".concat(exceptionData.GetMessageString());
            }
            else if (typeof e === "string") {
                errorMessage = e;
                // console.log();
            }
            else {
                errorMessage = "Unkown error: " + e;
                // console.log();
            }
            console.error("".concat(this.constructor.name, ".calculateNodeResult(").concat(node.PartName, " error: ").concat(errorMessage));
            console.log("".concat(this.constructor.name, ".calculateNodeResult(").concat(node.PartName, " error: ").concat(errorMessage));
            return JSON.stringify({
                error: "".concat(errorMessage)
            });
            // throw e;
        }
    };
    CSGNodeCalculator.prototype.appendTopoShapeData = function (node, shape, topoShapesData, shapeIndex) {
        var _a;
        var perfMeshing = _common_performer__WEBPACK_IMPORTED_MODULE_8__["default"].create().start();
        var meshDto = node.MetadataRequests.find(function (dto) { return dto.Kind === _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeMetadataKind.Mesh; });
        var _b = meshDto !== undefined
            ? __classPrivateFieldGet(this, _CSGNodeCalculator_instances, "m", _CSGNodeCalculator_prepareResultMeshForShape).call(this, shape, meshDto.TheLinDeflection, meshDto.TheAngDeflection)
            : { faceListData: { faces: [] }, edgeListData: { edges: [] } }, faceListData = _b.faceListData, edgeListData = _b.edgeListData;
        perfMeshing.measure("calculateNodeResult() mesh shape nr " + (shapeIndex++) + " node: " + node.PartName);
        var p = __classPrivateFieldGet(this, _CSGNodeCalculator_geometry, "f").getShapePosition_gp_XYZ(shape);
        var q = __classPrivateFieldGet(this, _CSGNodeCalculator_geometry, "f").getShapeRotation_gp_Quaternion(shape);
        var _c = __classPrivateFieldGet(this, _CSGNodeCalculator_geometry, "f").getQuaternionAngleAxis(q), angle = _c.angle, axis = _c.axis;
        var topoShapeData = {
            mesh: {
                faceListData: faceListData,
                edgeListData: edgeListData,
            },
            translation: { x: p.X(), y: p.Y(), z: p.Z(), },
            scale: { x: 1, y: 1, z: 1 },
            rotation: { x: axis[0], y: axis[1], z: axis[2], angleRad: angle }
        };
        if (_common_featureFlags__WEBPACK_IMPORTED_MODULE_9__["default"].sendBackNodeDebugData) {
            topoShapeData._node = node;
        }
        if (_common_featureFlags__WEBPACK_IMPORTED_MODULE_9__["default"].sendBackShapeVerticesData) {
            topoShapeData.verticesData = {
                vertices: __classPrivateFieldGet(this, _CSGNodeCalculator_geometry, "f").shapes.listShapeVerticesAsPoints(shape)
                    .map(function (gp_pnt) { return [gp_pnt.X(), gp_pnt.Y(), gp_pnt.Z()]; })
            };
        }
        if (_common_featureFlags__WEBPACK_IMPORTED_MODULE_9__["default"].sendBackShapeUserData) {
            var aabb = node.MetadataRequests.find(function (dto) { return dto.Kind === _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeMetadataKind.AABB; }) !== undefined
                ? __classPrivateFieldGet(this, _CSGNodeCalculator_geometry, "f").boundingBoxes.getAABB(shape, false)
                : {};
            var obb = node.MetadataRequests.find(function (dto) { return dto.Kind === _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeMetadataKind.OBB; }) !== undefined
                ? __classPrivateFieldGet(this, _CSGNodeCalculator_geometry, "f").boundingBoxes.getOBB(shape, false)
                : {};
            topoShapeData.obb = obb;
            topoShapeData.aabb = aabb;
            topoShapeData._shapeUserData = (_a = shape.userData) !== null && _a !== void 0 ? _a : { isEmpty: true };
        }
        topoShapeData.ShapeType = __classPrivateFieldGet(this, _CSGNodeCalculator_geometry, "f").shapes.getShapeTypeAsString(shape);
        topoShapesData.topoShapes.push(topoShapeData);
        shape.topoShapeData = topoShapeData;
        // console.log("### topoShapeData: "+topoShapeData);
    };
    /**
     *
     * @param node
     * @param explodeShapes If true all the shapes will be put into cache individually, thats to support 'disjoin' operation which produces multiple shapes out of single compound shape.
     *
     * @returns calculated shapes.
     */
    CSGNodeCalculator.prototype.calculateNodeShapesWithCache = function (node) {
        var _this = this;
        var result = __classPrivateFieldGet(this, _CSGNodeCalculator_nodeCacheMap, "f").get(node.PartName);
        if (result !== undefined) {
            return result.shapes;
        }
        var shapes = __classPrivateFieldGet(this, _CSGNodeCalculator_instances, "m", _CSGNodeCalculator_calculateNodeShapes).call(this, node);
        var explodeShapes = node.Type === _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.Operation && node.Operation === _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGOperationType.Disjoin;
        if (!explodeShapes) {
            __classPrivateFieldGet(this, _CSGNodeCalculator_nodeCacheMap, "f").set(node.PartName, {
                shapes: shapes
            });
        }
        else {
            shapes.forEach(function (shape, index) {
                var id = index < 1 ? "".concat(node.PartName) : "".concat(node.PartName, "_").concat(index);
                __classPrivateFieldGet(_this, _CSGNodeCalculator_nodeCacheMap, "f").set(id, {
                    shapes: [shape]
                });
            });
        }
        return shapes;
    };
    return CSGNodeCalculator;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CSGNodeCalculator);
_CSGNodeCalculator_geometry = new WeakMap(), _CSGNodeCalculator_solidFactory = new WeakMap(), _CSGNodeCalculator_planeFactory = new WeakMap(), _CSGNodeCalculator_wireFactory = new WeakMap(), _CSGNodeCalculator_faceFactory = new WeakMap(), _CSGNodeCalculator_vertexFactory = new WeakMap(), _CSGNodeCalculator_compoundFactory = new WeakMap(), _CSGNodeCalculator_wireOperationCalculator = new WeakMap(), _CSGNodeCalculator_operationCalculator = new WeakMap(), _CSGNodeCalculator_transformCalculator = new WeakMap(), _CSGNodeCalculator_nodeCacheMap = new WeakMap(), _CSGNodeCalculator_instances = new WeakSet(), _CSGNodeCalculator_calculateNodeShapes = function _CSGNodeCalculator_calculateNodeShapes(node) {
    //// console.log(`${this.constructor.name}.calculateNodeShape(${node.PartName} called...`);
    var shapes = undefined;
    var perf = _common_performer__WEBPACK_IMPORTED_MODULE_8__["default"].create().start();
    switch (node.Type) {
        case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.Reference:
            shapes = __classPrivateFieldGet(this, _CSGNodeCalculator_instances, "m", _CSGNodeCalculator_calculateReferenceNodeShapes).call(this, node);
            break;
        case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.Solid:
            shapes = [__classPrivateFieldGet(this, _CSGNodeCalculator_solidFactory, "f").createNodeShape(node)];
            break;
        case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.Plane:
            shapes = [__classPrivateFieldGet(this, _CSGNodeCalculator_planeFactory, "f").createNodeShape(node)];
            break;
        case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.Operation:
            shapes = __classPrivateFieldGet(this, _CSGNodeCalculator_operationCalculator, "f").calculateOperation(node);
            break;
        case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.Wire:
            shapes = [__classPrivateFieldGet(this, _CSGNodeCalculator_wireFactory, "f").createNodeShape(node)];
            break;
        case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.WireOperation:
            shapes = __classPrivateFieldGet(this, _CSGNodeCalculator_wireOperationCalculator, "f").calculateOperation(node);
            break;
        case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.Face:
            shapes = [__classPrivateFieldGet(this, _CSGNodeCalculator_faceFactory, "f").createNodeShape(node)];
            break;
        case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.Vertex:
            shapes = [__classPrivateFieldGet(this, _CSGNodeCalculator_vertexFactory, "f").createNodeShape(node)];
            break;
        case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.Compound:
            shapes = [__classPrivateFieldGet(this, _CSGNodeCalculator_compoundFactory, "f").createNodeShape(node)];
            break;
        case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.Transform:
            shapes = __classPrivateFieldGet(this, _CSGNodeCalculator_transformCalculator, "f").calculateTransforms(node);
            break;
        default:
            throw new Error("Node type ".concat(node.Type, " is unsupported yet."));
    }
    perf.measure("calculateNodeShape() node: " + node.PartName);
    node._calculateNodeShapeDuration = perf.lastMeasure();
    return shapes;
}, _CSGNodeCalculator_calculateReferenceNodeShapes = function _CSGNodeCalculator_calculateReferenceNodeShapes(node) {
    if (node.Type !== _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.Reference)
        throw new Error("Given node is not a ".concat(_csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.Reference));
    var cachedValue = __classPrivateFieldGet(this, _CSGNodeCalculator_nodeCacheMap, "f").get(node.ReferencePartName);
    if (cachedValue === undefined) {
        throw new Error("".concat(this.constructor.name, ".calculateReferenceNode(").concat(node.PartName, ") cache missed looking for reference node: ").concat(node.ReferencePartName, "."));
    }
    return cachedValue.shapes;
}, _CSGNodeCalculator_prepareResultMeshForShape = function _CSGNodeCalculator_prepareResultMeshForShape(shape, theLinDeflection, theAngDeflection) {
    // const oc = this.#geometry.openCascade;
    // if (shape.ShapeType() === oc.TopAbs_ShapeEnum.TopAbs_WIRE)
    // {
    //     // let facesAndEdges = this.#prepareResultMesh2(shape);
    //     let facesAndEdges = this.#geometry.visualize.ShapeToMesh(shape, 0.01, 0.05);
    //
    //     let faceListData = {
    //         faces: facesAndEdges[0]
    //     };
    //     let edgeListData = {
    //         // edges: []
    //         edges: facesAndEdges[1]
    //     };
    //
    //     return {faceListData, edgeListData};
    // }
    {
        // let faceListData = this.#prepareResultMesh(shape);
        // let edgeListData = { edges: []};
        var facesAndEdges = __classPrivateFieldGet(this, _CSGNodeCalculator_geometry, "f").makeIntoSingleMesh_My(shape, true, theLinDeflection, theAngDeflection);
        var faceListData = { faces: facesAndEdges.faces };
        var edgeListData = { edges: facesAndEdges.edges };
        // let edgeListData = {edges: []};
        return { faceListData: faceListData, edgeListData: edgeListData };
    }
};


/***/ }),

/***/ "./src/csg/csgOperationCalculator.js":
/*!*******************************************!*\
  !*** ./src/csg/csgOperationCalculator.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _csgTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./csgTypes */ "./src/csg/csgTypes.ts");
/* harmony import */ var _common_featureFlags__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../common/featureFlags */ "./src/common/featureFlags.js");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CSGOperationCalculator_instances, _CSGOperationCalculator_geometry, _CSGOperationCalculator_nodeCalculator, _CSGOperationCalculator_union, _CSGOperationCalculator_difference, _CSGOperationCalculator_intersection, _CSGOperationCalculator_clone, _CSGOperationCalculator_join, _CSGOperationCalculator_disjoin, _CSGOperationCalculator_sliceOff, _CSGOperationCalculator_offset, _CSGOperationCalculator_hollow;


var CSGOperationCalculator = /** @class */ (function () {
    function CSGOperationCalculator(geometry, nodeCalculator) {
        _CSGOperationCalculator_instances.add(this);
        _CSGOperationCalculator_geometry.set(this, void 0);
        _CSGOperationCalculator_nodeCalculator.set(this, void 0);
        __classPrivateFieldSet(this, _CSGOperationCalculator_geometry, geometry, "f");
        __classPrivateFieldSet(this, _CSGOperationCalculator_nodeCalculator, nodeCalculator, "f");
    }
    CSGOperationCalculator.prototype.calculateOperation = function (node) {
        if (node.Type !== _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.Operation)
            throw new Error("Given node is not an ".concat(_csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.Operation));
        var shapes = undefined;
        switch (node.Operation) {
            case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGOperationType.Union:
                shapes = __classPrivateFieldGet(this, _CSGOperationCalculator_instances, "m", _CSGOperationCalculator_union).call(this, node.Nodes);
                break;
            case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGOperationType.Difference:
                shapes = __classPrivateFieldGet(this, _CSGOperationCalculator_instances, "m", _CSGOperationCalculator_difference).call(this, node.Nodes);
                break;
            case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGOperationType.Intersection:
                shapes = __classPrivateFieldGet(this, _CSGOperationCalculator_instances, "m", _CSGOperationCalculator_intersection).call(this, node.Nodes);
                break;
            case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGOperationType.Clone:
                shapes = __classPrivateFieldGet(this, _CSGOperationCalculator_instances, "m", _CSGOperationCalculator_clone).call(this, node.Nodes);
                break;
            case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGOperationType.Join:
                shapes = __classPrivateFieldGet(this, _CSGOperationCalculator_instances, "m", _CSGOperationCalculator_join).call(this, node.Nodes);
                break;
            case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGOperationType.Disjoin:
                shapes = __classPrivateFieldGet(this, _CSGOperationCalculator_instances, "m", _CSGOperationCalculator_disjoin).call(this, node.Nodes);
                break;
            case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGOperationType.SliceOff:
                shapes = __classPrivateFieldGet(this, _CSGOperationCalculator_instances, "m", _CSGOperationCalculator_sliceOff).call(this, node.Nodes);
                break;
            case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGOperationType.Offset:
                shapes = __classPrivateFieldGet(this, _CSGOperationCalculator_instances, "m", _CSGOperationCalculator_offset).call(this, node.Nodes, node.OffsetValue, node.OffsetMode);
                break;
            case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGOperationType.Hollow:
                shapes = __classPrivateFieldGet(this, _CSGOperationCalculator_instances, "m", _CSGOperationCalculator_hollow).call(this, node.Nodes, node.FaceIndexes, node.WallThickness, node.JoinType);
                break;
            default:
                throw new Error("Node operation ".concat(node.Operation, " is unsupported yet."));
        }
        if (_common_featureFlags__WEBPACK_IMPORTED_MODULE_1__["default"].attachCSGNodeToShapeResult) {
            shapes.forEach(function (shape) {
                shape._node = node;
            });
        }
        return shapes;
    };
    return CSGOperationCalculator;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CSGOperationCalculator);
_CSGOperationCalculator_geometry = new WeakMap(), _CSGOperationCalculator_nodeCalculator = new WeakMap(), _CSGOperationCalculator_instances = new WeakSet(), _CSGOperationCalculator_union = function _CSGOperationCalculator_union(nodes) {
    var _this = this;
    var shapes = nodes.map(function (node) { return __classPrivateFieldGet(_this, _CSGOperationCalculator_nodeCalculator, "f").calculateNodeShapesWithCache(node); }).flat(1);
    var union = __classPrivateFieldGet(this, _CSGOperationCalculator_geometry, "f").booleans.makeUnion(shapes);
    return [union];
}, _CSGOperationCalculator_difference = function _CSGOperationCalculator_difference(nodes) {
    var _this = this;
    var shapes = nodes.map(function (node) { return __classPrivateFieldGet(_this, _CSGOperationCalculator_nodeCalculator, "f").calculateNodeShapesWithCache(node); }).flat(1);
    var targetShape = shapes[0];
    var toolShapes = shapes.slice(1);
    // let difference = this.#geometry.makeDifference(targetShape, toolShapes);
    var difference = __classPrivateFieldGet(this, _CSGOperationCalculator_geometry, "f").makeDifferenceMulti([targetShape], toolShapes);
    return [difference];
}, _CSGOperationCalculator_intersection = function _CSGOperationCalculator_intersection(nodes) {
    var _this = this;
    var shapes = nodes.map(function (node) { return __classPrivateFieldGet(_this, _CSGOperationCalculator_nodeCalculator, "f").calculateNodeShapesWithCache(node); }).flat(1);
    var intersection = __classPrivateFieldGet(this, _CSGOperationCalculator_geometry, "f").makeIntersection(shapes);
    return [intersection];
}, _CSGOperationCalculator_clone = function _CSGOperationCalculator_clone(nodes) {
    var _this = this;
    var shapes = nodes.map(function (node) { return __classPrivateFieldGet(_this, _CSGOperationCalculator_nodeCalculator, "f").calculateNodeShapesWithCache(node); }).flat(1);
    var cloned = __classPrivateFieldGet(this, _CSGOperationCalculator_geometry, "f").makeClone(shapes[0]);
    cloned.userData = __assign({}, shapes[0].userData);
    return [cloned];
}, _CSGOperationCalculator_join = function _CSGOperationCalculator_join(nodes) {
    var _this = this;
    var shapes = nodes.map(function (node) { return __classPrivateFieldGet(_this, _CSGOperationCalculator_nodeCalculator, "f").calculateNodeShapesWithCache(node); }).flat(1);
    var joined = __classPrivateFieldGet(this, _CSGOperationCalculator_geometry, "f").compounds.makeCompound(shapes);
    return [joined];
}, _CSGOperationCalculator_disjoin = function _CSGOperationCalculator_disjoin(nodes) {
    var _this = this;
    var shapes = nodes.map(function (node) { return __classPrivateFieldGet(_this, _CSGOperationCalculator_nodeCalculator, "f").calculateNodeShapesWithCache(node); }).flat(1);
    var explodedShapes = shapes.map(function (shape) {
        var disjoined = __classPrivateFieldGet(_this, _CSGOperationCalculator_geometry, "f").explodeCompound(shape);
        return disjoined;
    }).flat(1);
    return explodedShapes;
}, _CSGOperationCalculator_sliceOff = function _CSGOperationCalculator_sliceOff(nodes) {
    var _this = this;
    var shapes = nodes.map(function (node) { return __classPrivateFieldGet(_this, _CSGOperationCalculator_nodeCalculator, "f").calculateNodeShapesWithCache(node); }).flat(1);
    var sliced = shapes[0];
    for (var i = 1; i < shapes.length; i++) {
        var planeShape = shapes[i];
        sliced = __classPrivateFieldGet(this, _CSGOperationCalculator_geometry, "f").makeSplitWithPlane(sliced, planeShape, planeShape.userData.planePoint, planeShape.userData.planeNormal);
    }
    return [sliced];
}, _CSGOperationCalculator_offset = function _CSGOperationCalculator_offset(nodes, offset, mode) {
    var _this = this;
    var shapes = nodes.map(function (node) { return __classPrivateFieldGet(_this, _CSGOperationCalculator_nodeCalculator, "f").calculateNodeShapesWithCache(node); }).flat(1);
    var thickened = __classPrivateFieldGet(this, _CSGOperationCalculator_geometry, "f").makeOffset(shapes[0], offset, mode);
    return [thickened];
}, _CSGOperationCalculator_hollow = function _CSGOperationCalculator_hollow(nodes, faceIndexes, wallThickness, joinType) {
    var _this = this;
    var shapes = nodes.map(function (node) { return __classPrivateFieldGet(_this, _CSGOperationCalculator_nodeCalculator, "f").calculateNodeShapesWithCache(node); }).flat(1);
    var hollowed = __classPrivateFieldGet(this, _CSGOperationCalculator_geometry, "f").solidOperations.makeHollow(shapes[0], faceIndexes, wallThickness, joinType);
    return [hollowed];
};


/***/ }),

/***/ "./src/csg/csgPlaneFactory.js":
/*!************************************!*\
  !*** ./src/csg/csgPlaneFactory.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _csgTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./csgTypes */ "./src/csg/csgTypes.ts");
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CSGPlaneFactory_instances, _CSGPlaneFactory_geometry, _CSGPlaneFactory_createPlaneShape;

var CSGPlaneFactory = /** @class */ (function () {
    function CSGPlaneFactory(geometry) {
        _CSGPlaneFactory_instances.add(this);
        _CSGPlaneFactory_geometry.set(this, void 0);
        __classPrivateFieldSet(this, _CSGPlaneFactory_geometry, geometry, "f");
    }
    /**
        return: a shape.
     */
    CSGPlaneFactory.prototype.createNodeShape = function (node) {
        if (node.Type !== _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.Plane)
            throw new Error("Given node is not a ".concat(_csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.Plane));
        var shape = __classPrivateFieldGet(this, _CSGPlaneFactory_instances, "m", _CSGPlaneFactory_createPlaneShape).call(this, node.Plane);
        return shape;
    };
    return CSGPlaneFactory;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CSGPlaneFactory);
_CSGPlaneFactory_geometry = new WeakMap(), _CSGPlaneFactory_instances = new WeakSet(), _CSGPlaneFactory_createPlaneShape = function _CSGPlaneFactory_createPlaneShape(plane) {
    var shape = __classPrivateFieldGet(this, _CSGPlaneFactory_geometry, "f").makePlane(plane.Normal, plane.Point, plane.Width, plane.Height, 0.5, 0.5);
    shape.userData = {
        planePoint: plane.Point,
        planeNormal: plane.Normal,
        planeWidth: plane.Width,
        planeHeight: plane.Height
    };
    return shape;
};


/***/ }),

/***/ "./src/csg/csgSolidFactory.js":
/*!************************************!*\
  !*** ./src/csg/csgSolidFactory.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _csgTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./csgTypes */ "./src/csg/csgTypes.ts");
/* harmony import */ var _common_wires__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/wires */ "./src/common/wires.js");
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CSGSolidFactory_instances, _CSGSolidFactory_geometry, _CSGSolidFactory_nodeCalculator, _CSGSolidFactory_createBox, _CSGSolidFactory_createSphere, _CSGSolidFactory_createCylinder, _CSGSolidFactory_createExtrude, _CSGSolidFactory_createExtrudeWire, _CSGSolidFactory_createRevolveWire, _CSGSolidFactory_createSweepWire;


var CSGSolidFactory = /** @class */ (function () {
    function CSGSolidFactory(geometry, nodeCalculator) {
        _CSGSolidFactory_instances.add(this);
        _CSGSolidFactory_geometry.set(this, void 0);
        _CSGSolidFactory_nodeCalculator.set(this, void 0);
        __classPrivateFieldSet(this, _CSGSolidFactory_geometry, geometry, "f");
        __classPrivateFieldSet(this, _CSGSolidFactory_nodeCalculator, nodeCalculator, "f");
    }
    /**
        return: a shape.
     */
    CSGSolidFactory.prototype.createNodeShape = function (node) {
        if (node.Type !== _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.Solid)
            throw new Error("Given node is not a ".concat(_csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.Solid));
        var shape = undefined;
        switch (node.Solid.Type) {
            case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGSolidType.Box:
                shape = __classPrivateFieldGet(this, _CSGSolidFactory_instances, "m", _CSGSolidFactory_createBox).call(this, node.Solid);
                break;
            case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGSolidType.Sphere:
                shape = __classPrivateFieldGet(this, _CSGSolidFactory_instances, "m", _CSGSolidFactory_createSphere).call(this, node.Solid);
                break;
            case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGSolidType.Cylinder:
                shape = __classPrivateFieldGet(this, _CSGSolidFactory_instances, "m", _CSGSolidFactory_createCylinder).call(this, node.Solid);
                break;
            case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGSolidType.Extrude:
                shape = __classPrivateFieldGet(this, _CSGSolidFactory_instances, "m", _CSGSolidFactory_createExtrude).call(this, node.Solid);
                break;
            case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGSolidType.ExtrudeWire:
                shape = __classPrivateFieldGet(this, _CSGSolidFactory_instances, "m", _CSGSolidFactory_createExtrudeWire).call(this, node.Solid);
                break;
            case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGSolidType.RevolveWire:
                shape = __classPrivateFieldGet(this, _CSGSolidFactory_instances, "m", _CSGSolidFactory_createRevolveWire).call(this, node.Solid);
                break;
            case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGSolidType.SweepWire:
                shape = __classPrivateFieldGet(this, _CSGSolidFactory_instances, "m", _CSGSolidFactory_createSweepWire).call(this, node.Solid);
                break;
            default:
                throw new Error("Solid type ".concat(node.Solid.Type, " is not supported."));
        }
        return shape;
    };
    return CSGSolidFactory;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CSGSolidFactory);
_CSGSolidFactory_geometry = new WeakMap(), _CSGSolidFactory_nodeCalculator = new WeakMap(), _CSGSolidFactory_instances = new WeakSet(), _CSGSolidFactory_createBox = function _CSGSolidFactory_createBox(solid) {
    var box = __classPrivateFieldGet(this, _CSGSolidFactory_geometry, "f").makeBox(solid.Position[0], solid.Position[1], solid.Position[2], solid.Width, solid.Height, solid.Length, solid.PositionPivot[0], solid.PositionPivot[1], solid.PositionPivot[2]);
    return box;
}, _CSGSolidFactory_createSphere = function _CSGSolidFactory_createSphere(solid) {
    var sphere = __classPrivateFieldGet(this, _CSGSolidFactory_geometry, "f").makeSphere(solid.Position[0], solid.Position[1], solid.Position[2], solid.Radius);
    return sphere;
}, _CSGSolidFactory_createCylinder = function _CSGSolidFactory_createCylinder(solid) {
    var cylinder = __classPrivateFieldGet(this, _CSGSolidFactory_geometry, "f").makeCylinder([solid.Position[0], solid.Position[1], solid.Position[2]], [solid.Direction[0], solid.Direction[1], solid.Direction[2]], solid.Radius, solid.Height);
    return cylinder;
}, _CSGSolidFactory_createExtrude = function _CSGSolidFactory_createExtrude(solid) {
    var lines = solid.Sketch.Lines;
    var planePoint = solid.PlaneOrigin;
    var planeNormal = solid.PlaneNormal;
    var planeRotationZ = solid.PlaneRotationZ;
    var face = __classPrivateFieldGet(this, _CSGSolidFactory_geometry, "f").makeFaceFromLinesAndPlane(lines, planePoint, planeNormal, planeRotationZ);
    // const dir = [0, 0, solid.LengthUp];
    var extrude = __classPrivateFieldGet(this, _CSGSolidFactory_geometry, "f").sweeps.makeExtrude(face, planeNormal, solid.LengthUp, solid.LengthDown);
    return extrude;
}, _CSGSolidFactory_createExtrudeWire = function _CSGSolidFactory_createExtrudeWire(solid) {
    var wireNode = solid.Wire;
    var direction = solid.Direction;
    var lengthUp = solid.LengthUp;
    var lengthDown = solid.LengthDown;
    var wireShape = __classPrivateFieldGet(this, _CSGSolidFactory_nodeCalculator, "f").calculateNodeShapesWithCache(wireNode)[0];
    var face = __classPrivateFieldGet(this, _CSGSolidFactory_geometry, "f").faces.wiresToFaces([wireShape]);
    var extrude = __classPrivateFieldGet(this, _CSGSolidFactory_geometry, "f").sweeps.makeExtrude(face, direction, lengthUp, lengthDown);
    face.delete();
    return extrude;
}, _CSGSolidFactory_createRevolveWire = function _CSGSolidFactory_createRevolveWire(solid) {
    var wireNode = solid.Wire;
    var axisPoint = solid.AxisPoint;
    var axisDirection = solid.AxisDirection;
    var angleDeg = solid.Angle;
    var wireShape = __classPrivateFieldGet(this, _CSGSolidFactory_nodeCalculator, "f").calculateNodeShapesWithCache(wireNode)[0];
    var revolve = __classPrivateFieldGet(this, _CSGSolidFactory_geometry, "f").wireToSolid.revolveWireToMakeSolid(wireShape, axisPoint, axisDirection, angleDeg);
    return revolve;
}, _CSGSolidFactory_createSweepWire = function _CSGSolidFactory_createSweepWire(solid) {
    var profileNode = solid.Profile;
    var pathNode = solid.Path;
    var profileShape = __classPrivateFieldGet(this, _CSGSolidFactory_nodeCalculator, "f").calculateNodeShapesWithCache(profileNode)[0];
    var pathShape = __classPrivateFieldGet(this, _CSGSolidFactory_nodeCalculator, "f").calculateNodeShapesWithCache(pathNode)[0];
    var sweep = __classPrivateFieldGet(this, _CSGSolidFactory_geometry, "f").sweeps.pipeSolidFromWire(profileShape, pathShape);
    return sweep;
};


/***/ }),

/***/ "./src/csg/csgTransformCalculator.js":
/*!*******************************************!*\
  !*** ./src/csg/csgTransformCalculator.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _csgTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./csgTypes */ "./src/csg/csgTypes.ts");
/* harmony import */ var _common_math_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../common/math.js */ "./src/common/math.js");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CSGTransformCalculator_instances, _CSGTransformCalculator_geometry, _CSGTransformCalculator_nodeCalculator, _CSGTransformCalculator_transformShape, _CSGTransformCalculator_transformShapesUserData;


var CSGTransformCalculator = /** @class */ (function () {
    function CSGTransformCalculator(geometry, nodeCalculator) {
        _CSGTransformCalculator_instances.add(this);
        _CSGTransformCalculator_geometry.set(this, void 0);
        _CSGTransformCalculator_nodeCalculator.set(this, void 0);
        __classPrivateFieldSet(this, _CSGTransformCalculator_geometry, geometry, "f");
        __classPrivateFieldSet(this, _CSGTransformCalculator_nodeCalculator, nodeCalculator, "f");
    }
    CSGTransformCalculator.prototype.calculateTransforms = function (node) {
        var _this = this;
        if (node.Type !== _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.Transform)
            throw new Error("Given node is not an ".concat(_csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.Transform));
        var targetShapes = __classPrivateFieldGet(this, _CSGTransformCalculator_nodeCalculator, "f").calculateNodeShapesWithCache(node.Node);
        var transformedShapes = targetShapes.map(function (targetShape) { return __classPrivateFieldGet(_this, _CSGTransformCalculator_instances, "m", _CSGTransformCalculator_transformShape).call(_this, targetShape, node); });
        return transformedShapes;
    };
    return CSGTransformCalculator;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CSGTransformCalculator);
_CSGTransformCalculator_geometry = new WeakMap(), _CSGTransformCalculator_nodeCalculator = new WeakMap(), _CSGTransformCalculator_instances = new WeakSet(), _CSGTransformCalculator_transformShape = function _CSGTransformCalculator_transformShape(shape, node) {
    var transformedShape = shape;
    if (node.Append === false) {
        transformedShape = __classPrivateFieldGet(this, _CSGTransformCalculator_geometry, "f").resetLocation(transformedShape);
    }
    var isScaleIdentity = node.Transform.scale[0] === 1 && node.Transform.scale[1] === 1 && node.Transform.scale[2] === 1;
    if (node.UseS && !isScaleIdentity) {
        transformedShape = __classPrivateFieldGet(this, _CSGTransformCalculator_geometry, "f").makeScale(transformedShape, node.Transform.scale);
    }
    var isRotationZero = node.Transform.rotation[3] <= _common_math_js__WEBPACK_IMPORTED_MODULE_1__["default"].kEpsilon;
    if (node.UseR && !isRotationZero) {
        var axis = node.Transform.rotation.slice(0, 3);
        var angleRad = _common_math_js__WEBPACK_IMPORTED_MODULE_1__["default"].degToRad(node.Transform.rotation[3]);
        transformedShape = __classPrivateFieldGet(this, _CSGTransformCalculator_geometry, "f").makeRotation(transformedShape, axis, angleRad);
    }
    var isTranslationZero = node.Transform.translation[0] === 0 && node.Transform.translation[1] === 0 && node.Transform.translation[2] === 0;
    if (node.UseT && !isTranslationZero) {
        transformedShape = __classPrivateFieldGet(this, _CSGTransformCalculator_geometry, "f").makeTranslate(transformedShape, node.Transform.translation);
    }
    transformedShape.userData = __assign({}, shape.userData);
    __classPrivateFieldGet(this, _CSGTransformCalculator_instances, "m", _CSGTransformCalculator_transformShapesUserData).call(this, transformedShape, node);
    //// console.log("transformShape() transformShape.userData: "+JSON.stringify(transformedShape.userData, null, 2));
    return transformedShape;
}, _CSGTransformCalculator_transformShapesUserData = function _CSGTransformCalculator_transformShapesUserData(shape, node) {
    // For now only plane's point and normal are supported
    if (shape.userData.planePoint === undefined
        || shape.userData.planeNormal === undefined) {
        return;
    }
    var planePoint = shape.userData.planePoint;
    var planeNormal = shape.userData.planeNormal;
    if (node.Append === false) {
        planePoint = [0, 0, 0];
        planeNormal = [0, 0, 1];
    }
    var isScaleIdentity = node.Transform.scale[0] === 1 && node.Transform.scale[1] === 1 && node.Transform.scale[2] === 1;
    if (node.UseS && !isScaleIdentity) {
        planeNormal = __classPrivateFieldGet(this, _CSGTransformCalculator_geometry, "f").vectors.scale(planeNormal, node.Transform.scale);
    }
    var isRotationZero = node.Transform.rotation[3] <= _common_math_js__WEBPACK_IMPORTED_MODULE_1__["default"].kEpsilon;
    if (node.UseR && !isRotationZero) {
        var axis = node.Transform.rotation.slice(0, 3);
        var angleRad = _common_math_js__WEBPACK_IMPORTED_MODULE_1__["default"].degToRad(node.Transform.rotation[3]);
        // transformedShape = this.#geometry.makeRotation(transformedShape, axis, angleRad);
        planeNormal = __classPrivateFieldGet(this, _CSGTransformCalculator_geometry, "f").vectors.rotate(planeNormal, axis, angleRad);
    }
    var isTranslationZero = node.Transform.translation[0] === 0 && node.Transform.translation[1] === 0 && node.Transform.translation[2] === 0;
    if (node.UseT && !isTranslationZero) {
        // transformedShape = this.#geometry.makeTranslate(transformedShape, node.Transform.translation);
        planePoint = __classPrivateFieldGet(this, _CSGTransformCalculator_geometry, "f").vectors.translate(planePoint, node.Transform.translation);
    }
    shape.userData.planePoint = planePoint;
    shape.userData.planeNormal = planeNormal;
};


/***/ }),

/***/ "./src/csg/csgTypes.ts":
/*!*****************************!*\
  !*** ./src/csg/csgTypes.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CSGCompoundType: () => (/* binding */ CSGCompoundType),
/* harmony export */   CSGFaceType: () => (/* binding */ CSGFaceType),
/* harmony export */   CSGNodeMetadataKind: () => (/* binding */ CSGNodeMetadataKind),
/* harmony export */   CSGNodeType: () => (/* binding */ CSGNodeType),
/* harmony export */   CSGOperationType: () => (/* binding */ CSGOperationType),
/* harmony export */   CSGSolidType: () => (/* binding */ CSGSolidType),
/* harmony export */   CSGVertexType: () => (/* binding */ CSGVertexType),
/* harmony export */   CSGWireOperationType: () => (/* binding */ CSGWireOperationType),
/* harmony export */   CSGWireType: () => (/* binding */ CSGWireType),
/* harmony export */   SVGEdgeType: () => (/* binding */ SVGEdgeType)
/* harmony export */ });
var CSGNodeType;
(function (CSGNodeType) {
    CSGNodeType["Nothing"] = "Nothing";
    CSGNodeType["Solid"] = "Solid";
    CSGNodeType["Plane"] = "Plane";
    CSGNodeType["Operation"] = "Operation";
    CSGNodeType["Face"] = "Face";
    CSGNodeType["Wire"] = "Wire";
    CSGNodeType["WireOperation"] = "WireOperation";
    CSGNodeType["Vertex"] = "Vertex";
    CSGNodeType["Compound"] = "Compound";
    CSGNodeType["Reference"] = "Reference";
    CSGNodeType["Transform"] = "Transform";
})(CSGNodeType || (CSGNodeType = {}));
var CSGNodeMetadataKind;
(function (CSGNodeMetadataKind) {
    CSGNodeMetadataKind["Mesh"] = "Mesh";
    CSGNodeMetadataKind["AABB"] = "AABB";
    CSGNodeMetadataKind["OBB"] = "OBB";
})(CSGNodeMetadataKind || (CSGNodeMetadataKind = {}));
var CSGOperationType;
(function (CSGOperationType) {
    CSGOperationType["Union"] = "Union";
    CSGOperationType["Difference"] = "Difference";
    CSGOperationType["Intersection"] = "Intersection";
    CSGOperationType["SliceOff"] = "SliceOff";
    CSGOperationType["Clone"] = "Clone";
    CSGOperationType["Join"] = "Join";
    CSGOperationType["Disjoin"] = "Disjoin";
    CSGOperationType["Offset"] = "Offset";
    CSGOperationType["Hollow"] = "Hollow";
})(CSGOperationType || (CSGOperationType = {}));
var CSGWireOperationType;
(function (CSGWireOperationType) {
    CSGWireOperationType["Nothing"] = "Nothing";
    CSGWireOperationType["Project"] = "Project";
    CSGWireOperationType["Offset"] = "Offset";
})(CSGWireOperationType || (CSGWireOperationType = {}));
var CSGSolidType;
(function (CSGSolidType) {
    CSGSolidType["Sphere"] = "Sphere";
    CSGSolidType["Box"] = "Box";
    CSGSolidType["Cylinder"] = "Cylinder";
    CSGSolidType["Mesh"] = "Mesh";
    CSGSolidType["Extrude"] = "Extrude";
    CSGSolidType["ExtrudeWire"] = "ExtrudeWire";
    CSGSolidType["RevolveWire"] = "RevolveWire";
    CSGSolidType["SweepWire"] = "SweepWire";
})(CSGSolidType || (CSGSolidType = {}));
var CSGWireType;
(function (CSGWireType) {
    CSGWireType["Polygon"] = "Polygon";
    CSGWireType["Bezier"] = "Bezier";
    CSGWireType["BSpline"] = "BSpline";
})(CSGWireType || (CSGWireType = {}));
var SVGEdgeType;
(function (SVGEdgeType) {
    SVGEdgeType["Line"] = "Line";
    SVGEdgeType["BezierCubic"] = "BezierCubic";
    SVGEdgeType["BezierQuadratic"] = "BezierQuadratic";
    //TODO add Arc: "Arc"
})(SVGEdgeType || (SVGEdgeType = {}));
var CSGFaceType;
(function (CSGFaceType) {
    CSGFaceType["FaceFromWires"] = "FaceFromWires";
    CSGFaceType["SelectFaceFromShapeByAxis"] = "SelectFaceFromShapeByAxis";
    CSGFaceType["SelectFaceByIndex"] = "SelectFaceByIndex";
})(CSGFaceType || (CSGFaceType = {}));
var CSGVertexType;
(function (CSGVertexType) {
    CSGVertexType["FromPoint"] = "FromPoint";
    CSGVertexType["FromToShapeProjection"] = "FromToShapeProjection";
    CSGVertexType["FromClosestPointOnShapeProjection"] = "FromClosestPointOnShapeProjection";
})(CSGVertexType || (CSGVertexType = {}));
var CSGCompoundType;
(function (CSGCompoundType) {
    CSGCompoundType["FromFile"] = "FromFile";
})(CSGCompoundType || (CSGCompoundType = {}));



/***/ }),

/***/ "./src/csg/csgVertexFactory.js":
/*!*************************************!*\
  !*** ./src/csg/csgVertexFactory.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _csgTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./csgTypes */ "./src/csg/csgTypes.ts");
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CSGVertexFactory_instances, _CSGVertexFactory_geometry, _CSGVertexFactory_nodeCalculator, _CSGVertexFactory_createVertexFromPoint, _CSGVertexFactory_createVertexFromToShapeProjection, _CSGVertexFactory_createVertexFromClosestPointOnShapeProjection;

var CSGVertexFactory = /** @class */ (function () {
    function CSGVertexFactory(geometry, nodeCalculator) {
        _CSGVertexFactory_instances.add(this);
        _CSGVertexFactory_geometry.set(this, void 0);
        _CSGVertexFactory_nodeCalculator.set(this, void 0);
        __classPrivateFieldSet(this, _CSGVertexFactory_geometry, geometry, "f");
        __classPrivateFieldSet(this, _CSGVertexFactory_nodeCalculator, nodeCalculator, "f");
    }
    /**
        return: a shape.
     */
    CSGVertexFactory.prototype.createNodeShape = function (node) {
        if (node.Type !== _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.Vertex)
            throw new Error("Given node is not a ".concat(_csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.Vertex));
        var shape = undefined;
        switch (node.Vertex.Type) {
            case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGVertexType.FromPoint:
                shape = __classPrivateFieldGet(this, _CSGVertexFactory_instances, "m", _CSGVertexFactory_createVertexFromPoint).call(this, node.Vertex);
                break;
            case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGVertexType.FromToShapeProjection:
                shape = __classPrivateFieldGet(this, _CSGVertexFactory_instances, "m", _CSGVertexFactory_createVertexFromToShapeProjection).call(this, node.Vertex);
                break;
            case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGVertexType.FromClosestPointOnShapeProjection:
                shape = __classPrivateFieldGet(this, _CSGVertexFactory_instances, "m", _CSGVertexFactory_createVertexFromClosestPointOnShapeProjection).call(this, node.Vertex);
                break;
            default:
                throw new Error("Vertex type ".concat(node.Vertex.Type, " is not supported."));
        }
        return shape;
    };
    return CSGVertexFactory;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CSGVertexFactory);
_CSGVertexFactory_geometry = new WeakMap(), _CSGVertexFactory_nodeCalculator = new WeakMap(), _CSGVertexFactory_instances = new WeakSet(), _CSGVertexFactory_createVertexFromPoint = function _CSGVertexFactory_createVertexFromPoint(vertex) {
    var vertexShape = __classPrivateFieldGet(this, _CSGVertexFactory_geometry, "f").projections.createVertexFromPoint(vertex.Point);
    return vertexShape;
}, _CSGVertexFactory_createVertexFromToShapeProjection = function _CSGVertexFactory_createVertexFromToShapeProjection(vertex) {
    var projectionTargetShape = __classPrivateFieldGet(this, _CSGVertexFactory_nodeCalculator, "f").calculateNodeShapesWithCache(vertex.Shape)[0];
    var _a = __classPrivateFieldGet(this, _CSGVertexFactory_geometry, "f").projections.projectPointOntoShape(vertex.Point, vertex.Direction, projectionTargetShape), intersectionFound = _a.intersectionFound, point = _a.point, normal = _a.normal;
    // console.log("if: "+intersectionFound +" p: "+point);
    if (!intersectionFound) {
        throw new Error("No intersection found.");
    }
    var vertexShape = __classPrivateFieldGet(this, _CSGVertexFactory_geometry, "f").projections.createVertexFrom_gp_Pnt(point);
    vertexShape.userData = {
        normal: [normal.X(), normal.Y(), normal.Z()]
    };
    return vertexShape;
}, _CSGVertexFactory_createVertexFromClosestPointOnShapeProjection = function _CSGVertexFactory_createVertexFromClosestPointOnShapeProjection(vertex) {
    var projectionTargetShape = __classPrivateFieldGet(this, _CSGVertexFactory_nodeCalculator, "f").calculateNodeShapesWithCache(vertex.Shape)[0];
    var projectedPoint = __classPrivateFieldGet(this, _CSGVertexFactory_geometry, "f").projections.findClosestPointOnShape(vertex.Point, projectionTargetShape);
    var vertexShape = __classPrivateFieldGet(this, _CSGVertexFactory_geometry, "f").projections.createVertexFrom_gp_Pnt(projectedPoint);
    return vertexShape;
};


/***/ }),

/***/ "./src/csg/csgWireFactory.js":
/*!***********************************!*\
  !*** ./src/csg/csgWireFactory.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _csgTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./csgTypes */ "./src/csg/csgTypes.ts");
/* harmony import */ var _common_wires__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/wires */ "./src/common/wires.js");
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CSGWireFactory_instances, _CSGWireFactory_geometry, _CSGWireFactory_createPolygon, _CSGWireFactory_createBSpline, _CSGWireFactory_createBezier, _CSGWireFactory_createBezierFromSVGPath, _CSGWireFactory_createWireFromSVGPaths, _CSGWireFactory_fitBezier;


var CSGWireFactory = /** @class */ (function () {
    function CSGWireFactory(geometry) {
        _CSGWireFactory_instances.add(this);
        _CSGWireFactory_geometry.set(this, void 0);
        __classPrivateFieldSet(this, _CSGWireFactory_geometry, geometry, "f");
    }
    /**
        return: a shape.
     */
    CSGWireFactory.prototype.createNodeShape = function (node) {
        if (node.Type !== _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.Wire)
            throw new Error("Given node is not a ".concat(_csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.Wire));
        var shape = undefined;
        switch (node.Wire.Type) {
            case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGWireType.Polygon:
                shape = __classPrivateFieldGet(this, _CSGWireFactory_instances, "m", _CSGWireFactory_createPolygon).call(this, node.Wire);
                break;
            case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGWireType.Bezier:
                shape = __classPrivateFieldGet(this, _CSGWireFactory_instances, "m", _CSGWireFactory_createBezier).call(this, node.Wire);
                break;
            case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGWireType.BSpline:
                shape = __classPrivateFieldGet(this, _CSGWireFactory_instances, "m", _CSGWireFactory_createBSpline).call(this, node.Wire);
                break;
            default:
                throw new Error("Wire type ".concat(node.Wire.Type, " is not supported."));
        }
        return shape;
    };
    return CSGWireFactory;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CSGWireFactory);
_CSGWireFactory_geometry = new WeakMap(), _CSGWireFactory_instances = new WeakSet(), _CSGWireFactory_createPolygon = function _CSGWireFactory_createPolygon(wireData) {
    var wireShape = __classPrivateFieldGet(this, _CSGWireFactory_geometry, "f").wires.makePolygonWireFromPoins(wireData.Points, wireData.IsClosed);
    return wireShape;
}, _CSGWireFactory_createBSpline = function _CSGWireFactory_createBSpline(wireData) {
    var continuity = __classPrivateFieldGet(this, _CSGWireFactory_geometry, "f").wires.parseContinuityAs_GeomAbs_Shape(wireData.CurveContinuity);
    var wireShape = __classPrivateFieldGet(this, _CSGWireFactory_geometry, "f").wires.fitBSplineWireFromPoints(wireData.Points, wireData.IsClosed, continuity);
    return wireShape;
}, _CSGWireFactory_createBezier = function _CSGWireFactory_createBezier(wireData) {
    var continuity = __classPrivateFieldGet(this, _CSGWireFactory_geometry, "f").wires.parseContinuityAs_GeomAbs_Shape(wireData.CurveContinuity);
    if (wireData.Points !== undefined && wireData.Points != null) {
        return __classPrivateFieldGet(this, _CSGWireFactory_instances, "m", _CSGWireFactory_fitBezier).call(this, wireData);
    }
    else if (wireData.BezierSegments !== undefined && wireData.BezierSegments !== null) {
        return __classPrivateFieldGet(this, _CSGWireFactory_instances, "m", _CSGWireFactory_createBezierFromSVGPath).call(this, wireData);
    }
    else if (wireData.SVGPaths !== undefined && wireData.SVGPaths !== null) {
        return __classPrivateFieldGet(this, _CSGWireFactory_instances, "m", _CSGWireFactory_createWireFromSVGPaths).call(this, wireData);
    }
    else {
        throw new Error("WireData was wrong. WireData: " + JSON.stringify(wireData, null, 2));
    }
}, _CSGWireFactory_createBezierFromSVGPath = function _CSGWireFactory_createBezierFromSVGPath(wireData) {
    var wireShape = __classPrivateFieldGet(this, _CSGWireFactory_geometry, "f").wires.makeBezierFromSVGPath(wireData.BezierSegments, wireData.IsClosed);
    return wireShape;
}, _CSGWireFactory_createWireFromSVGPaths = function _CSGWireFactory_createWireFromSVGPaths(wireData) {
    var wireShape = __classPrivateFieldGet(this, _CSGWireFactory_geometry, "f").wires.makeSVGPathsWire(wireData.SVGPaths);
    return wireShape;
}, _CSGWireFactory_fitBezier = function _CSGWireFactory_fitBezier(wireData) {
    var continuity = __classPrivateFieldGet(this, _CSGWireFactory_geometry, "f").wires.parseContinuityAs_GeomAbs_Shape(wireData.CurveContinuity);
    var wireShape = __classPrivateFieldGet(this, _CSGWireFactory_geometry, "f").wires.makeBezierWireFromControlPoints(wireData.Points, wireData.IsClosed, continuity);
    // let wireShape = this.#geometry.wires.fitBezierWireFromPoints(wireData.Points, wireData.IsClosed, continuity);
    return wireShape;
};


/***/ }),

/***/ "./src/csg/csgWireOperationCalculator.js":
/*!***********************************************!*\
  !*** ./src/csg/csgWireOperationCalculator.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _csgTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./csgTypes */ "./src/csg/csgTypes.ts");
/* harmony import */ var _common_featureFlags__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../common/featureFlags */ "./src/common/featureFlags.js");
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CSGWireOperationCalculator_instances, _CSGWireOperationCalculator_geometry, _CSGWireOperationCalculator_nodeCalculator, _CSGWireOperationCalculator_project, _CSGWireOperationCalculator_offsetWire;


var CSGWireOperationCalculator = /** @class */ (function () {
    function CSGWireOperationCalculator(geometry, nodeCalculator) {
        _CSGWireOperationCalculator_instances.add(this);
        _CSGWireOperationCalculator_geometry.set(this, void 0);
        _CSGWireOperationCalculator_nodeCalculator.set(this, void 0);
        __classPrivateFieldSet(this, _CSGWireOperationCalculator_geometry, geometry, "f");
        __classPrivateFieldSet(this, _CSGWireOperationCalculator_nodeCalculator, nodeCalculator, "f");
    }
    CSGWireOperationCalculator.prototype.calculateOperation = function (node) {
        if (node.Type !== _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.WireOperation)
            throw new Error("Given node is not an ".concat(_csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGNodeType.WireOperation));
        var shapes = undefined;
        switch (node.OperationType) {
            case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGWireOperationType.Project:
                shapes = __classPrivateFieldGet(this, _CSGWireOperationCalculator_instances, "m", _CSGWireOperationCalculator_project).call(this, node);
                break;
            case _csgTypes__WEBPACK_IMPORTED_MODULE_0__.CSGWireOperationType.Offset:
                shapes = __classPrivateFieldGet(this, _CSGWireOperationCalculator_instances, "m", _CSGWireOperationCalculator_offsetWire).call(this, node);
                break;
            default:
                throw new Error("Wire operation ".concat(node.Operation, " is unsupported yet."));
        }
        if (_common_featureFlags__WEBPACK_IMPORTED_MODULE_1__["default"].attachCSGNodeToShapeResult) {
            shapes.forEach(function (shape) {
                shape._node = node;
            });
        }
        return shapes;
    };
    return CSGWireOperationCalculator;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CSGWireOperationCalculator);
_CSGWireOperationCalculator_geometry = new WeakMap(), _CSGWireOperationCalculator_nodeCalculator = new WeakMap(), _CSGWireOperationCalculator_instances = new WeakSet(), _CSGWireOperationCalculator_project = function _CSGWireOperationCalculator_project(node) {
    var wireNode = node.Wire;
    var targetNode = node.ProjectionTarget;
    var direction = node.Direction;
    var wireShape = __classPrivateFieldGet(this, _CSGWireOperationCalculator_nodeCalculator, "f").calculateNodeShapesWithCache(wireNode)[0];
    var targetShape = __classPrivateFieldGet(this, _CSGWireOperationCalculator_nodeCalculator, "f").calculateNodeShapesWithCache(targetNode)[0];
    var result = __classPrivateFieldGet(this, _CSGWireOperationCalculator_geometry, "f").wires.projectWireOntoFace(wireShape, targetShape, direction);
    return [result];
}, _CSGWireOperationCalculator_offsetWire = function _CSGWireOperationCalculator_offsetWire(node) {
    var wireNode = node.Wire;
    var offset = node.Offset;
    var joinType = node.JoinType;
    var wireShape = __classPrivateFieldGet(this, _CSGWireOperationCalculator_nodeCalculator, "f").calculateNodeShapesWithCache(wireNode)[0];
    var result = __classPrivateFieldGet(this, _CSGWireOperationCalculator_geometry, "f").wires.offsetWire(wireShape, offset, joinType);
    return [result];
};


/***/ }),

/***/ "./src/occt/booleans.ts":
/*!******************************!*\
  !*** ./src/occt/booleans.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _common_compounds__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/compounds */ "./src/common/compounds.ts");

var booleans = {
    oc: null,
    setOpenCascade: function (openCascade) {
        this.oc = openCascade;
    },
    makeUnion: function (shapesToJoin, keepEdges) {
        var oc = this.oc;
        var explodedShapes = shapesToJoin
            .map(function (shape) { return _common_compounds__WEBPACK_IMPORTED_MODULE_0__["default"].deCompoundShape(shape); })
            .flat(1);
        var combined = explodedShapes[0];
        for (var i = 1; i < explodedShapes.length; i++) {
            var shape1 = combined;
            var shape2 = explodedShapes[i];
            var progressRange = new oc.Message_ProgressRange_1();
            var combinedFuse = new oc.BRepAlgoAPI_Fuse_3(shape1, shape2, progressRange);
            combined = combinedFuse.Shape();
            progressRange.delete();
            combinedFuse.delete();
        }
        if (!keepEdges) {
            var fusor = new oc.ShapeUpgrade_UnifySameDomain_2(combined, true, false, false);
            fusor.Build();
            combined = fusor.Shape();
            fusor.delete();
        }
        return combined;
    },
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (booleans);


/***/ }),

/***/ "./src/occt/boundingBoxes.ts":
/*!***********************************!*\
  !*** ./src/occt/boundingBoxes.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var boundingBoxes = {
    oc: null,
    setOpenCascade: function (openCascade) {
        this.oc = openCascade;
    },
    getOBB: function (shape, useTriangulation) {
        var oc = this.oc;
        useTriangulation = useTriangulation !== null && useTriangulation !== void 0 ? useTriangulation : true;
        var obb = new oc.Bnd_OBB_1();
        oc.BRepBndLib.AddOBB(shape, obb, useTriangulation, true, true);
        var obbox = {
            isValid: false,
            center: [NaN, NaN, NaN],
            hsize: [NaN, NaN, NaN],
            xdir: [NaN, NaN, NaN],
            ydir: [NaN, NaN, NaN],
            zdir: [NaN, NaN, NaN]
        };
        if (!obb.IsVoid()) {
            var center = obb.Center();
            var xhSize = obb.XHSize();
            var yhSize = obb.YHSize();
            var zhSize = obb.ZHSize();
            var xDir = obb.XDirection(); // X direction
            var yDir = obb.YDirection(); // Y direction
            var zDir = obb.ZDirection(); // Z direction
            obbox.isValid = true;
            obbox.center = [center.X(), center.Y(), center.Z()];
            obbox.hsize = [xhSize, yhSize, zhSize];
            obbox.xdir = [xDir.X(), xDir.Y(), xDir.Z()];
            obbox.ydir = [yDir.X(), yDir.Y(), yDir.Z()];
            obbox.zdir = [zDir.X(), zDir.Y(), zDir.Z()];
        }
        obb.delete();
        return obbox;
    },
    getAABB: function (shape, useTriangulation) {
        var oc = this.oc;
        useTriangulation = useTriangulation !== null && useTriangulation !== void 0 ? useTriangulation : true;
        var aabb = new oc.Bnd_Box_1();
        oc.BRepBndLib.Add(shape, aabb, useTriangulation);
        var aabbox = { isValid: false, min: [NaN, NaN, NaN], max: [NaN, NaN, NaN] };
        if (!aabb.IsVoid()) {
            var xmin = { current: 0 }, ymin = { current: 0 }, zmin = { current: 0 }, xmax = { current: 0 }, ymax = { current: 0 }, zmax = { current: 0 };
            aabb.Get(xmin, ymin, zmin, xmax, ymax, zmax);
            aabbox.isValid = true;
            aabbox.min = [xmin.current, ymin.current, zmin.current];
            aabbox.max = [xmax.current, ymax.current, zmax.current];
        }
        aabb.delete();
        return aabbox;
    },
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (boundingBoxes);


/***/ }),

/***/ "./src/occt/faces.ts":
/*!***************************!*\
  !*** ./src/occt/faces.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _common_compounds__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/compounds */ "./src/common/compounds.ts");

var faces = {
    oc: null,
    setOpenCascade: function (openCascade) {
        this.oc = openCascade;
    },
    /**
     *
     * @param face: TopoDS_Face
     * @param stepU: number
     * @param stepV: number
     * @return array of normals : gp_Dir[]
     */
    sampleFaceNormals: function (face, stepU, stepV) {
        var oc = this.oc;
        // Get UV domain range
        var uMin = { current: 0 }, uMax = { current: 0 }, vMin = { current: 0 }, vMax = { current: 0 };
        oc.BRepTools.UVBounds_1(face, uMin, uMax, vMin, vMax);
        var normals = [];
        // // Adapt the face to a surface to evaluate it
        // let adaptorSurface = new oc.BRepAdaptor_Surface_2(face, true);
        // let adaptorSurfaceHandle = new oc.Handle_Geom_Surface_2(adaptorSurface);
        // Handle(Geom_Surface) surface = BRep_Tool.Surface2(aFace);
        var surface = oc.BRep_Tool.Surface_2(face);
        // Create SLProps to evaluate surface properties
        var surfaceProps = new oc.GeomLProp_SLProps_2(surface, 1, 0.01);
        for (var u = uMin.current; u <= uMax.current; u += stepU) {
            for (var v = vMin.current; v <= vMax.current; v += stepV) {
                surfaceProps.SetParameters(u, v);
                if (surfaceProps.IsNormalDefined()) {
                    var pointOnSurface = surfaceProps.Value();
                    var normal = surfaceProps.Normal();
                    normals.push(normal);
                }
            }
        }
        surface.delete();
        surfaceProps.delete();
        return normals;
    },
    /**
     * @param wireShapes [wire, wire, ...] Array of shapes
     * @return {TopoDS_Face}
     */
    wiresToFaces: function (wireShapes) {
        var oc = this.oc;
        wireShapes = wireShapes.map(function (wireShape) { return _common_compounds__WEBPACK_IMPORTED_MODULE_0__["default"].listWiresInsideCompound(wireShape); }).flat(1);
        // wireShapes = wireShapes.map(wireShape => compounds.listWiresInsideCompound(wireShape)).flat(1);
        var wiresCompound = _common_compounds__WEBPACK_IMPORTED_MODULE_0__["default"].makeCompound(wireShapes);
        var face = new oc.TopoDS_Face();
        var done = oc.BOPAlgo_Tools.WiresToFaces(wiresCompound, face, .001);
        return face;
    },
    // TODO: chat gpt on boolean on wires:
    // Open CASCADE Technology (OCCT) is a software development platform that provides tools for 3D surface and solid modeling, visualization, data exchange, and more. If you're working with OCCT and want to perform Boolean operations between flat wires (like two flat circles in 3D space), you can certainly do that. However, keep in mind that Boolean operations like union, difference, and intersection are typically applied between solids or surfaces rather than wires.
    //
    // If you're aiming to find the Boolean sum of two flat wires like circles, you might want to convert them into faces (surfaces) first. Here's a basic overview:
    //
    // Create two flat circles in 3D space.
    //
    //     Use GC_MakeCircle to create the circles.
    // Create an edge from the circle using BRepBuilderAPI_MakeEdge.
    //     Convert the edge to a wire using BRepBuilderAPI_MakeWire.
    // Convert the wires to faces.
    //
    // Use BRepBuilderAPI_MakeFace to generate a planar face from the wire.
    //     Perform the Boolean operation.
    //
    // Use BRepAlgoAPI_Fuse for a union operation.
    //     Use BRepAlgoAPI_Cut for a difference operation.
    //     Use BRepAlgoAPI_Common for an intersection operation.
    //     Remember that when working with Boolean operations, it's essential to ensure that the geometries are correctly defined and don't contain errors, as these can sometimes cause the Boolean operations to fail or yield unexpected results.
    //
    // Lastly, be aware that the API or method names mentioned above are based on the state of OCCT as of my last training data in September 2021. The library could have been updated or changed since then, so always consult the latest documentation or resources when working with the OCCT platform.
    // TODO: other wire "primitives"
    //     please list other occt methods to create wires like GC MakeCircle ?
    //         ChatGPT
    //         Open CASCADE Technology (OCCT) provides a wide range of methods to create wires from various geometric and topological constructs. Here's a list of some methods to generate curves, which can subsequently be transformed into edges and wires:
    //
    //     Open CASCADE Technology (OCCT) provides a wide range of methods to create wires from various geometric and topological constructs. Here's a list of some methods to generate curves, which can subsequently be transformed into edges and wires:
    //
    // 1. **Lines**:
    // - `GC_MakeLine`: Creates a line from two points or a point and a direction.
    //
    // 2. **Circles**:
    // - `GC_MakeCircle`: As you mentioned, it creates a circle using different inputs, such as three points, a center and a point, a center and a radius, etc.
    //
    // 3. **Ellipses**:
    // - `GC_MakeEllipse`: Creates an ellipse using a major axis, a minor axis, and the radius ratios.
    // - `GC_MakeEllipsoidalHelix`: Creates an ellipsoidal helix.
    //
    // 4. **Hyperbolas**:
    // - `GC_MakeHyperbola`: Creates a hyperbola using its main axis, another axis, and the major and minor radius.
    //
    // 5. **Parabolas**:
    // - `GC_MakeParabola`: Creates a parabola using its axis and a focal length.
    //
    // 6. **Segmented curves**:
    // - `GC_MakeArcOfCircle`: Creates a circular arc from three points or other definitions.
    // - `GC_MakeSegment`: Creates a segment between two points on a given curve.
    //
    // 7. **Splines**:
    // - `GeomAPI_PointsToBSpline`: Creates a B-spline curve from a series of points.
    //
    // 8. **Offset curves**:
    // - `GC_MakeOffsetCurve`: Creates a curve offset from another curve.
    //
    // 9. **Interpolated curves**:
    // - `GeomAPI_Interpolate`: Creates a curve that interpolates a series of points, with optional tangents.
    //
    // 10. **Helix**:
    // - `GC_MakeHelix`: Creates a helical curve with a given pitch, radius, and orientation.
    //
    //     After creating the desired curve using one of the methods above, you can use `BRepBuilderAPI_MakeEdge` to create an edge from the curve. Once the edge is available, you can create a wire using `BRepBuilderAPI_MakeWire`.
    //
    //     Remember, this list is not exhaustive. OCCT provides a rich set of tools to create various geometric and topological constructs. Always refer to the official OCCT documentation to find the latest and most comprehensive list of methods available.
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (faces);


/***/ }),

/***/ "./src/occt/occtio.ts":
/*!****************************!*\
  !*** ./src/occt/occtio.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var occtio = {
    oc: null,
    setOpenCascade: function (openCascade) {
        this.oc = openCascade;
    },
    /**
     * https://github.com/donalffons/opencascade.js/issues/222
     *
     * @param shape
     * @param points
     */
    shapeToBRep: function (shape) {
        var oc = this.oc;
        var theProgress = new oc.Message_ProgressRange_1();
        var result = oc.BRepTools.Write_3(shape, "test", theProgress);
        var brep = oc.FS.readFile("/" + "test", { encoding: "utf8" });
        oc.FS.unlink("/" + "test");
        // console.log(result)
        // console.log(brep)
        return brep;
    },
    bRepToShape: function (shapeBRepText) {
        var oc = this.oc;
        var theProgress = new oc.Message_ProgressRange_1();
        oc.FS.writeFile("/" + "test", shapeBRepText, { encoding: "utf8" });
        var shape = new oc.TopoDS_Shape();
        var bRepBuilder = new oc.BRep_Builder();
        var ok = oc.BRepTools.Read_2(shape, "test", bRepBuilder, theProgress);
        oc.FS.unlink("/" + "test");
        if (!ok) {
            throw new Error("Could not read a shape from string:\n" + shapeBRepText);
        }
        return shape;
    },
    textToShape: function (stepText, fileType) {
        var oc = this.oc;
        // const fileName = "ubinputs.filename";
        // const stepText = stepText;
        // const fileType = "step";
        console.log(" ### stepText length: ", stepText.length);
        // console.log(" ### stepType: ", fileType);
        // return undefined;
        if (fileType === "brep") {
            return this.bRepToShape(stepText);
        }
        // Writes the uploaded file to Emscripten's Virtual Filesystem
        oc.FS.createDataFile('/', "file.".concat(fileType), stepText, true, true, true);
        // Choose the correct OpenCascade file parsers to read the CAD file
        var reader = null;
        if (fileType === 'step') {
            reader = new oc.STEPControl_Reader_1();
        }
        else if (fileType === 'iges') {
            reader = new oc.IGESControl_Reader_1();
        }
        else {
            console.error('opencascade can\'t parse this extension! (yet)');
        }
        var readResult = reader.ReadFile("file.".concat(fileType)); // Read the file
        if (readResult === oc.IFSelect_ReturnStatus.IFSelect_RetDone) {
            // Translate all transferable roots to OpenCascade
            var messageProgress = new oc.Message_ProgressRange_1();
            var numRootsTransferred = reader.TransferRoots(messageProgress);
            messageProgress.delete();
            var stepShape = reader.OneShape();
            // let adjustedShape;
            // if (adjustZtoY)
            // {
            //     let mirroredShape = this.och.mirrorAlongNormal(
            //         { shape: stepShape, origin: [0, 0, 0], normal: [0, 0, 1] }
            //     );
            //     adjustedShape = this.och.rotate({ shape: mirroredShape, axis: [1, 0, 0], angle: 90 });
            //     mirroredShape.delete();
            // }
            // Out with the old, in with the new!
            // Remove the file when we're done (otherwise we run into errors on reupload)
            oc.FS.unlink("/file.".concat(fileType));
            // if(adjustedShape)
            // {
            //     stepShape.delete();
            //     stepShape = adjustedShape;
            // }
            return stepShape;
        }
        else {
            console.error('Something in OCCT went wrong trying to read a shape from step text: ', stepText);
        }
        return undefined;
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (occtio);


/***/ }),

/***/ "./src/occt/projections.ts":
/*!*********************************!*\
  !*** ./src/occt/projections.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _common_openCascadeHelper_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/openCascadeHelper.js */ "./src/common/openCascadeHelper.js");
/* harmony import */ var _common_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/utils.js */ "./src/common/utils.js");

// import utils from "../common/utils";

var projections = {
    oc: null,
    setOpenCascade: function (openCascade) {
        this.oc = openCascade;
    },
    /**
     * Taken from chatGPT: can you show me an example on how to project an arbitrary point onto a TopoDS_Shape solid face ?
     * @param shape TopoDS Shape
     * @param points: [[x,y,z], ... ]
     */
    projectPointsOnShape: function (shape, points) {
        // // Create a TopoDS_Shape object representing your solid face
        // TopoDS_Shape face = ...;
        //
        // // Get the surface geometry of the face
        // Handle(Geom_Surface) surface = BRep_Tool::Surface(TopoDS::Face(face));
        //
        // // Create a GeomAPI_ProjectPointOnSurf object to project the point onto the surface
        // GeomAPI_ProjectPointOnSurf proj(point, surface);
        //
        // // Get the projected point on the surface
        // gp_Pnt projectedPoint = proj.NearestPoint();
        // or
        // // First, we need to include the relevant OpenCASCADE headers
        // #include <TopoDS_Shape.hxx>
        // #include <TopoDS_Face.hxx>
        // #include <BRepAdaptor_Surface.hxx>
        // #include <GeomAPI_ProjectPointOnSurf.hxx>
        //
        // // Let's assume we already have a TopoDS_Shape object representing
        // // the solid and a face of the solid that we want to project the point onto
        // TopoDS_Shape solid;
        // TopoDS_Face face;
        //
        // // Next, we create a surface adaptor for the face
        // BRepAdaptor_Surface surface_adaptor(face);
        //
        // // Then, we create a GeomAPI_ProjectPointOnSurf object, which will
        // // be used to project the point onto the face
        // GeomAPI_ProjectPointOnSurf proj;
        // proj.Init(surface_adaptor);
        //
        // // Now, we can define the point that we want to project onto the face
        // gp_Pnt point(10.0, 0.0, 0.0);
        //
        // // Finally, we can project the point onto the face using the
        // // GeomAPI_ProjectPointOnSurf object
        // proj.Perform(point);
        //
        // // The projected point is stored in the proj object, and we can
        // // access it using the following code:
        // gp_Pnt projected_point = proj.NearestPoint();
    },
    /**
     *
     * @param point: [x,y,z]
     * @param direction: [x,y,z]
     * @param target
     * @return projected point : gp_Pnt
     */
    projectPointOntoShape: function (point, direction, target) {
        var _this = this;
        var oc = this.oc;
        var pnt = _common_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].convertTo_gp_Pnt(point);
        var dir = _common_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].convertTo_gp_Dir(direction);
        // let dir = new oc.gp_Dir_4(direction[0], direction[1], (direction[2]) ? direction[2] : 0);
        var ray = new oc.gp_Lin_3(pnt, dir);
        var isIntersecting = false;
        var minDist = Number.MAX_VALUE;
        var closestIntersection = null;
        var normalDirection = null;
        _common_openCascadeHelper_js__WEBPACK_IMPORTED_MODULE_0__["default"].ForEachFace(target, function (faceIndex, face) {
            var intersector = new oc.IntCurvesFace_Intersector(face, _this.oc.Precision.Confusion(), true, true);
            intersector.Perform_1(ray, 0.0, Number.MAX_VALUE);
            if (intersector.IsDone() && intersector.NbPnt() > 0) {
                for (var i = 1; i <= intersector.NbPnt(); i++) {
                    var intersectionPoint = intersector.Pnt(i);
                    var dist = pnt.SquareDistance(intersectionPoint);
                    if (dist < minDist) {
                        minDist = dist;
                        closestIntersection = intersectionPoint;
                        isIntersecting = true;
                        var _a = _this.getFaceNormalFromPoint(face, closestIntersection), normalFound = _a.normalFound, normal = _a.normal;
                        normalDirection = normal;
                    }
                }
            }
            intersector.delete();
        });
        return { intersectionFound: isIntersecting, point: closestIntersection, normal: normalDirection };
    },
    /**
     * gp_Dir normalDirection;
     *
     * if (isIntersecting) {
     *     // Get the face containing the closest intersection point
     *     const TopoDS_Face& intersectedFace = TopoDS::Face(faceExplorer.Current());
     *
     *     // Retrieve the underlying surface of the face
     *     Handle(Geom_Surface) surface;
     *     TopLoc_Location location;
     *     surface = BRep_Tool::Surface(intersectedFace, location);
     *
     *     // Convert world space coordinates to the local parameters (u, v) of the surface
     *     GeomAPI_ProjectPointOnSurf projector(closestIntersection, surface);
     *     Standard_Real u, v;
     *     projector.LowerDistanceParameters(u, v);
     *
     *     // Define a local properties computation object
     *     BRepAdaptor_Surface surfaceAdaptor(intersectedFace);
     *     BRepLProp_SLProps localProps(surfaceAdaptor, 2, Precision::Confusion());
     *
     *     // Set the point of interest using the local parameters (u, v)
     *     localProps.SetParameters(u, v);
     *
     *     if (localProps.IsNormalDefined()) {
     *         normalDirection = localProps.Normal();
     *         if (intersectedFace.Orientation() == TopAbs_REVERSED) {
     *             normalDirection.Reverse();
     *         }
     *     }
     * }
     */
    getFaceNormalFromPoint: function (face, pnt) {
        // Retrieve the underlying surface of the face
        // Handle(Geom_Surface) surface;
        var location = new this.oc.TopLoc_Location_1();
        var surface = this.oc.BRep_Tool.Surface_1(face, location);
        // Convert world space coordinates to the local parameters (u, v) of the surface
        var projector = new this.oc.GeomAPI_ProjectPointOnSurf_2(pnt, surface, this.oc.Extrema_ExtAlgo);
        var u = { current: 0 };
        var v = { current: 0 };
        projector.LowerDistanceParameters(u, v);
        // Define a local properties computation object
        var surfaceAdaptor = new this.oc.BRepAdaptor_Surface_2(face, false);
        var localProps = new this.oc.BRepLProp_SLProps_2(surfaceAdaptor, 2, this.oc.Precision.Confusion());
        // Set the point of interest using the local parameters (u, v)
        localProps.SetParameters(u.current, v.current);
        var normalDirection = null;
        if (localProps.IsNormalDefined()) {
            normalDirection = localProps.Normal();
            // console.log("face orientation is: "+face.Orientation_1() == TopAbs_FORWARD);
            // if (face.Orientation_1() == this.oc!.TopAbs_Orientation.TopAbs_REVERSED) {
            //     normalDirection.Reverse();
            // }
        }
        location.delete();
        surface.delete();
        projector.delete();
        surfaceAdaptor.delete();
        localProps.delete();
        return { normalFound: normalDirection !== null, normal: normalDirection };
    },
    // /**
    //  *
    //  * @param point: [x,y,z]
    //  * @param direction: [x,y,z]
    //  * @param target
    //  * @return projected point : gp_Pnt
    //  */
    // findClosestPointOnShape(point: number[], target: TopoDS_Shape) {
    //     const oc = this.oc!;
    //
    //     let projectedPoint : gp_Pnt | null = null;
    //    
    //     och.ForEachFace(target, (faceIndex : number, face : TopoDS_Face) => {
    //        
    //         if (projectedPoint) return;
    //        
    //         let surface : Handle_Geom_Surface = oc.BRep_Tool.Surface_2(face);
    //         let pnt : gp_Pnt = utils.convertTo_gp_Pnt(point);
    //         let proj : GeomAPI_ProjectPointOnSurf = new oc.GeomAPI_ProjectPointOnSurf_2(pnt, surface, oc.Extrema_ExtAlgo);
    //         projectedPoint = proj.NearestPoint();
    //        
    //         pnt.delete();
    //         proj.delete();
    //     });
    //
    //     return projectedPoint;
    // },
    /**
     *
     * @param point: [x,y,z]
     * @param target
     * @return projected point : gp_Pnt
     */
    findClosestPointOnShape: function (point, target) {
        var oc = this.oc;
        var projectedPoint = null;
        _common_openCascadeHelper_js__WEBPACK_IMPORTED_MODULE_0__["default"].ForEachFace(target, function (faceIndex, face) {
            if (projectedPoint)
                return;
            var surface = oc.BRep_Tool.Surface_2(face);
            var uMin = { current: 0 }, uMax = { current: 0 }, vMin = { current: 0 }, vMax = { current: 0 };
            oc.BRepTools.UVBounds_1(face, uMin, uMax, vMin, vMax);
            var pnt = _common_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].convertTo_gp_Pnt(point);
            var proj = new oc.GeomAPI_ProjectPointOnSurf_2(pnt, surface, oc.Extrema_ExtAlgo);
            // console.log("### projection points: "+proj.NbPoints());
            var nearestPnt = proj.NearestPoint();
            // Check if this nearest point is truly within the face's actual boundaries
            // let uv: gp_Pnt2d = proj.LowerDistanceParameters();
            var u = { current: 0 };
            var v = { current: 0 };
            proj.LowerDistanceParameters(u, v);
            var faceClassifier = new oc.BRepTopAdaptor_FClass2d(face, oc.Precision.PConfusion_2());
            var uvPnt = new oc.gp_Pnt2d_3(u.current, v.current);
            var state = faceClassifier.Perform(uvPnt, true);
            if (state == oc.TopAbs_State.TopAbs_ON || state == oc.TopAbs_State.TopAbs_IN) {
                projectedPoint = nearestPnt;
            }
            else {
                //TODO: here we need to go and find the closest point to any edge of this face and compare the found point to 
                // closest points from other faces or their edges
                // from this set we need to get the one that is closest to the input point.
                // to check: should be classify on-edge-projected points if they are actually part of the edge ? (do edges have uv coordinates as well, well singe dimension ofcourse...) 
            }
            pnt.delete();
            proj.delete();
            uvPnt.delete();
            faceClassifier.delete();
        });
        if (projectedPoint === null) {
            throw new Error("Did not manage to find closest point.");
        }
        return projectedPoint;
    },
    //     when it comes to edges do we also need to classify an edge nearest projected point if its actually on the egde ?
    //
    //         ChatGPT
    //         Yes, when dealing with edges, especially in the context of more complex shapes, it is possible for the projection to lie outside the actual parametric range of the edge. For example, imagine you project a point onto a curved edge, and the closest point on the underlying curve is beyond the end of the edge. In such a case, the point isn't on the actual edge, even though it's on the curve the edge is based on.
    //
    //     To confirm that the projected point lies on the edge, you'd need to check if the projected parameter is within the parametric range of the edge.
    //
    //     Here's how you can do that:
    //
    //     When you obtain the underlying curve of the edge using BRep_Tool::Curve, also retrieve the parameter range (firstParam and lastParam).
    // After projecting the point onto the curve, retrieve the parameter of the projection using GeomAPI_ProjectPointOnCurve::LowerDistanceParameter().
    //     Check if the projected parameter is within the range [firstParam, lastParam].
    //     Here's an addition to the previous code that performs this check:
    //
    // javascript
    // Copy code
    // /**
    //  *
    //  * @param point: [x, y, z]
    //  * @param edge: TopoDS_Edge
    //  * @return closest point : gp_Pnt | null
    //  */
    // findClosestPointOnEdge(point: number[], edge: TopoDS_Edge) {
    //     const oc = this.oc!;
    //
    //     // Convert the array to a gp_Pnt
    //     let pnt = new oc.gp_Pnt(point[0], point[1], point[2]);
    //
    //     // Extract the underlying geometric curve from the edge
    //     let firstParam = new oc.Standard_Real();
    //     let lastParam = new oc.Standard_Real();
    //     let curve = oc.BRep_Tool.Curve(edge, firstParam, lastParam);
    //
    //     // Project the point onto the curve
    //     let project = new oc.GeomAPI_ProjectPointOnCurve(pnt, curve);
    //
    //     // Check if the projected point lies within the edge's parameter range
    //     let param = project.LowerDistanceParameter();
    //     if (param < firstParam.Value() || param > lastParam.Value()) {
    //         // The projection is outside the range of the edge
    //         pnt.delete();
    //         firstParam.delete();
    //         lastParam.delete();
    //         curve.delete();
    //         project.delete();
    //         return null;
    //     }
    //
    //     // Get the nearest point on the curve
    //     let nearestPoint = project.NearestPoint();
    //
    //     pnt.delete();
    //     firstParam.delete();
    //     lastParam.delete();
    //     curve.delete();
    //     project.delete();
    //
    //     return nearestPoint;
    // }
    createVertexFromPoint: function (point) {
        var oc = this.oc;
        var pnt = _common_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].convertTo_gp_Pnt(point);
        var vertex = this.createVertexFrom_gp_Pnt(pnt);
        return vertex;
    },
    createVertexFrom_gp_Pnt: function (pnt) {
        var oc = this.oc;
        var makeVertex = new oc.BRepBuilderAPI_MakeVertex(pnt);
        var vertex = makeVertex.Vertex();
        return vertex;
    },
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (projections);


/***/ }),

/***/ "./src/occt/shapes.js":
/*!****************************!*\
  !*** ./src/occt/shapes.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _common_math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/math */ "./src/common/math.js");

var shapes = {
    setOpenCascade: function (openCascade) {
        this.oc = openCascade;
    },
    // export declare type TopAbs_ShapeEnum = {
    //     TopAbs_COMPOUND: {};
    //     TopAbs_COMPSOLID: {};
    //     TopAbs_SOLID: {};
    //     TopAbs_SHELL: {};
    //     TopAbs_FACE: {};
    //     TopAbs_WIRE: {};
    //     TopAbs_EDGE: {};
    //     TopAbs_VERTEX: {};
    //     TopAbs_SHAPE: {};
    // }
    getShapeTypeAsString: function (shape) {
        var oc = this.oc;
        var t = shape.ShapeType();
        if (t === oc.TopAbs_ShapeEnum.TopAbs_COMPOUND)
            return "TopAbs_COMPOUND";
        if (t === oc.TopAbs_ShapeEnum.TopAbs_COMPSOLID)
            return "TopAbs_COMPSOLID";
        if (t === oc.TopAbs_ShapeEnum.TopAbs_SOLID)
            return "TopAbs_SOLID";
        if (t === oc.TopAbs_ShapeEnum.TopAbs_SHELL)
            return "TopAbs_SHELL";
        if (t === oc.TopAbs_ShapeEnum.TopAbs_FACE)
            return "TopAbs_FACE";
        if (t === oc.TopAbs_ShapeEnum.TopAbs_WIRE)
            return "TopAbs_WIRE";
        if (t === oc.TopAbs_ShapeEnum.TopAbs_EDGE)
            return "TopAbs_EDGE";
        if (t === oc.TopAbs_ShapeEnum.TopAbs_VERTEX)
            return "TopAbs_VERTEX";
        if (t === oc.TopAbs_ShapeEnum.TopAbs_SHAPE)
            return "TopAbs_SHAPE";
        throw new Error("Unknowsn shape type: '" + t + "'");
    },
    getActualTypeOfShape: function (shape) {
        var result = shape;
        if (shape.ShapeType() === this.oc.TopAbs_ShapeEnum.TopAbs_EDGE) {
            result = this.oc.TopoDS.Edge_1(shape);
        }
        else if (shape.ShapeType() === this.oc.TopAbs_ShapeEnum.TopAbs_WIRE) {
            result = this.oc.TopoDS.Wire_1(shape);
        }
        else if (shape.ShapeType() === this.oc.TopAbs_ShapeEnum.TopAbs_VERTEX) {
            result = this.oc.TopoDS.Vertex_1(shape);
        }
        else if (shape.ShapeType() === this.oc.TopAbs_ShapeEnum.TopAbs_SOLID) {
            result = this.oc.TopoDS.Solid_1(shape);
        }
        else if (shape.ShapeType() === this.oc.TopAbs_ShapeEnum.TopAbs_SHELL) {
            result = this.oc.TopoDS.Shell_1(shape);
        }
        else if (shape.ShapeType() === this.oc.TopAbs_ShapeEnum.TopAbs_FACE) {
            result = this.oc.TopoDS.Face_1(shape);
        }
        else if (shape.ShapeType() === this.oc.TopAbs_ShapeEnum.TopAbs_COMPSOLID) {
            result = this.oc.TopoDS.CompSolid_1(shape);
        }
        else if (shape.ShapeType() === this.oc.TopAbs_ShapeEnum.TopAbs_COMPOUND) {
            result = this.oc.TopoDS.Compound_1(shape);
        }
        else {
            result = shape;
        }
        return result;
    },
    clone: function () {
        var transformation = new this.oc.gp_Trsf_1();
        transformation.SetTranslation_1(new this.oc.gp_Vec_4(0, 0, 0));
        var location = new this.oc.TopLoc_Location_2(transformation);
        return shape.Moved(location, true);
    },
    /**
     *
     * @param shape
     * @param v [x,y,z]
     */
    translate: function (shape, v) {
        var transformation = new this.oc.gp_Trsf_1();
        transformation.SetTranslation_1(new this.oc.gp_Vec_4(v[0], v[1], v[2]));
        var location = new this.oc.TopLoc_Location_2(transformation);
        shape.Move(location, true);
        return shape;
    },
    /**
     *
     * @param shape
     * @param v gp_Vec
     */
    translate_gp_Vec: function (shape, v) {
        var transformation = new this.oc.gp_Trsf_1();
        transformation.SetTranslation_1(v);
        var location = new this.oc.TopLoc_Location_2(transformation);
        shape.Move(location, true);
        return shape;
    },
    rotate_gp_Quaternion: function (shape, q) {
        var transformation = new this.oc.gp_Trsf_1();
        transformation.SetRotation_2(q);
        var location = new this.oc.TopLoc_Location_2(transformation);
        shape.Move(location, true);
        return shape;
    },
    /**
     *
     * @param shape
     * @param v gp_Vec
     * @param q gp-Quaternion
     * @returns {*}
     */
    translateAndRotate: function (shape, v, q) {
        var transformation = new this.oc.gp_Trsf_1();
        transformation.SetRotationPart(q);
        transformation.SetTranslationPart(v);
        var location = new this.oc.TopLoc_Location_2(transformation);
        shape.Move(location, true);
        return shape;
    },
    listShapeVerticesAsTopoDS_Vertex: function (shape) {
        var oc = this.oc;
        var vertices = [];
        var anExplorer = new oc.TopExp_Explorer_1();
        for (anExplorer.Init(shape, oc.TopAbs_ShapeEnum.TopAbs_VERTEX, oc.TopAbs_ShapeEnum.TopAbs_SHAPE); anExplorer.More(); anExplorer.Next()) {
            vertices.push(anExplorer.Current());
        }
        return vertices;
    },
    /**
     *
     * @param shape
     * @returns {*[]} list shape's vertices as gp_Points
     */
    listShapeVerticesAsPoints: function (shape) {
        var oc = this.oc;
        var points = [];
        var anExplorer = new oc.TopExp_Explorer_1();
        for (anExplorer.Init(shape, oc.TopAbs_ShapeEnum.TopAbs_VERTEX, oc.TopAbs_ShapeEnum.TopAbs_SHAPE); anExplorer.More(); anExplorer.Next()) {
            // let vertex = anExplorer.Current();
            var vertex = oc.TopoDS.Vertex_1(anExplorer.Current());
            // //// console.log("listShapeVerticesAsPoints vertex: "+this.getShapeType(vertex))
            var gp_Pnt_point = oc.BRep_Tool.Pnt(vertex);
            points.push(gp_Pnt_point);
        }
        return points;
    },
    /**
     * Checks shape to plane orientaiton.
     * @param shape
     * @param planePoint [x,y,z]
     * @param planeNormal [x,y,z]
     */
    getShapeToPlaneOrientation: function (shape, planePoint, planeNormal) {
        //// console.log("getShapeToPlaneOrientation() shape: "+shape);
        var oc = this.oc;
        var ppXYZ = new oc.gp_XYZ_2(planePoint[0], planePoint[1], planePoint[2]);
        var pnXYZ = new oc.gp_XYZ_2(planeNormal[0], planeNormal[1], planeNormal[2]);
        // pnXYZ.Normalize();
        var result = {
            hasPositiveVertices: false,
            hasNegativeVertices: false,
            hasOnPlaneZeroVertices: false,
            get isAllPositive() { return this.hasPositiveVertices && !this.hasNegativeVertices && !this.hasOnPlaneZeroVertices; },
            get isPositive() { return this.hasPositiveVertices && !this.hasNegativeVertices; },
            get isAllNegative() { return !this.hasPositiveVertices && this.hasNegativeVertices && !this.hasOnPlaneZeroVertices; },
            get isNegative() { return !this.hasPositiveVertices && this.hasNegativeVertices; },
            get isAllOnPlane() { return !this.hasPositiveVertices && !this.hasNegativeVertices && this.hasOnPlaneZeroVertices; }
        };
        this.listShapeVerticesAsPoints(shape).forEach(function (vertex_gpPnt) {
            var planeToVertexXYZ = vertex_gpPnt.XYZ().Subtracted(ppXYZ);
            var dot = planeToVertexXYZ.Dot(pnXYZ);
            // on plane ?
            if (dot <= Math.abs(_common_math__WEBPACK_IMPORTED_MODULE_0__["default"].kEpsilon)) {
                result.hasOnPlaneZeroVertices = true;
            }
            // on positive side of the plane ?
            else if (dot > 0) {
                result.hasPositiveVertices = true;
            }
            // on negative side of the plane ?
            else if (dot < 0) {
                result.hasNegativeVertices = true;
            }
        });
        //// console.log("getShapeToPlaneOrientation() result: "+JSON.stringify(result, null, 2));
        return result;
    },
    isAnyShapeVertexOnThePositiveSideOfThePlane: function (shape, planePoint, planeNormal) {
        var oc = this.oc;
        var ppXYZ = new oc.gp_XYZ_2(planePoint[0], planePoint[1], planePoint[2]);
        var pnXYZ = new oc.gp_XYZ_2(planeNormal[0], planeNormal[1], planeNormal[2]);
        this.listShapeVerticesAsPoints(shape).forEach(function (vertex_gpPnt) {
            var planeToVertexXYZ = vertex_gpPnt.XYZ().Subtracted(ppXYZ);
            var dot = planeToVertexXYZ.Dot(pnXYZ);
            if (dot > 0)
                return true;
        });
        return false;
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (shapes);


/***/ }),

/***/ "./src/occt/solidOperations.ts":
/*!*************************************!*\
  !*** ./src/occt/solidOperations.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _common_openCascadeHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/openCascadeHelper */ "./src/common/openCascadeHelper.js");
/* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/utils */ "./src/common/utils.js");


var solidOperations = {
    oc: null,
    setOpenCascade: function (openCascade) {
        this.oc = openCascade;
    },
    makeHollow: function (shape, faceIndexes, wallThickness, joinType) {
        var oc = this.oc;
        var allFaces = _common_openCascadeHelper__WEBPACK_IMPORTED_MODULE_0__["default"].ListFaces(shape);
        var faces = faceIndexes.map(function (index) { return allFaces[index]; });
        var facesToRemove = new oc.TopTools_ListOfShape_1();
        faces.forEach(function (face) { facesToRemove.Append_1(face); });
        var progressRange = new oc.Message_ProgressRange_1();
        var aSolidMaker = new oc.BRepOffsetAPI_MakeThickSolid();
        var intersection = true;
        var selfIntersection = true;
        var geomJointType = _common_utils__WEBPACK_IMPORTED_MODULE_1__["default"].parseJoinType(joinType);
        var removeEdges = false;
        aSolidMaker.MakeThickSolidByJoin(shape, facesToRemove, wallThickness, oc.Precision.Confusion(), oc.BRepOffset_Mode.BRepOffset_Skin, 
        // oc.BRepOffset_Mode.BRepOffset_Pipe as any,
        // oc.BRepOffset_Mode.BRepOffset_RectoVerso as any,
        intersection, selfIntersection, geomJointType, removeEdges, progressRange);
        allFaces.forEach(function (face) { face.delete(); });
        facesToRemove.delete();
        var hollowed = aSolidMaker.Shape();
        return hollowed;
    },
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (solidOperations);


/***/ }),

/***/ "./src/occt/sweeps.js":
/*!****************************!*\
  !*** ./src/occt/sweeps.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _booleans__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./booleans */ "./src/occt/booleans.ts");
/* harmony import */ var _faces__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./faces */ "./src/occt/faces.ts");
/* harmony import */ var _common_compounds__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/compounds */ "./src/common/compounds.ts");



var sweeps = {
    setOpenCascade: function (openCascade) {
        this.oc = openCascade;
    },
    /**
     *
     * @param wire TopoDS_Wire shape
     * @param direction [x, y, z]
     * @param lengthUp Number
     * @param lengthDown Number
     */
    extrudeSolidFromWire: function (wire, direction, lengthUp, lengthDown) {
        var face = _faces__WEBPACK_IMPORTED_MODULE_1__["default"].wiresToFaces([wire]);
        var extrude = this.makeExtrude(face, direction, lengthUp, lengthDown);
        face.delete();
        return extrude;
    },
    /**
     *
     * @param face TopoDS_Face shape.
     * @param dir [x, y, z]
     * @param length how for along dir to extrude
     * @param lengthDown how for against dir to extrude
     */
    makeExtrude: function (face, dir, length, lengthDown) {
        var oc = this.oc;
        var shapesToJoin = [];
        // console.log("makeExtrude oc: ", oc)
        // console.log("makeExtrude face: ", face)
        // console.log("makeExtrude dir: ", dir)
        // console.log("makeExtrude length: ", length)
        // console.log("makeExtrude lengthDown: ", lengthDown)
        if (length > 0) {
            var aPrismVec = new oc.gp_Vec_4(dir[0], dir[1], dir[2]);
            aPrismVec.Normalize();
            aPrismVec.Multiply(length);
            // console.log("makeExtrude making body for length, aPrismVec: ", aPrismVec)
            var body = new oc.BRepPrimAPI_MakePrism_1(face, aPrismVec, false, true);
            // console.log("makeExtrude body created")
            shapesToJoin.push(body.Shape());
            body.delete();
        }
        if (lengthDown > 0) {
            var aPrismVecDown = new oc.gp_Vec_4(dir[0], dir[1], dir[2]);
            aPrismVecDown.Normalize();
            aPrismVecDown.Multiply(lengthDown * -1);
            // console.log("makeExtrude making body for lengthDown, aPrismVecDown: ", aPrismVecDown)
            var bodyDown = new oc.BRepPrimAPI_MakePrism_1(face, aPrismVecDown, false, true);
            // console.log("makeExtrude body created")
            shapesToJoin.push(bodyDown.Shape());
            aPrismVecDown.delete();
            bodyDown.delete();
        }
        var shape = null;
        if (shapesToJoin.length > 1) {
            shape = _booleans__WEBPACK_IMPORTED_MODULE_0__["default"].makeUnion(shapesToJoin);
        }
        else {
            shape = shapesToJoin[0];
        }
        return shape;
    },
    makePipeSolid: function (profileFace, pathWire) {
        var oc = this.oc;
        var pipeSolidAPI = new oc.BRepOffsetAPI_MakePipe_2(pathWire, profileFace, oc.GeomFill_Trihedron.GeomFill_IsFrenet, false);
        // export declare class BRepOffsetAPI_MakePipe_2 extends BRepOffsetAPI_MakePipe {
        //         constructor(Spine: TopoDS_Wire, Profile: TopoDS_Shape, aMode: GeomFill_Trihedron, ForceApproxC1: Standard_Boolean);
        //     }
        // pipeSolidAPI.SetMode(true);
        var pipeSolid = pipeSolidAPI.Shape();
        return pipeSolid;
    },
    pipeSolidFromWire: function (profileWire, pathWire) {
        var oc = this.oc;
        pathWire = _common_compounds__WEBPACK_IMPORTED_MODULE_2__["default"].listWiresInsideCompound(pathWire)[0];
        var wire = new oc.TopoDS.Wire_1(pathWire);
        var face = _faces__WEBPACK_IMPORTED_MODULE_1__["default"].wiresToFaces([profileWire]);
        var pipeSolid = this.makePipeSolid(face, wire);
        face.delete();
        wire.delete();
        return pipeSolid;
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (sweeps);


/***/ }),

/***/ "./src/tests/testOperations.js":
/*!*************************************!*\
  !*** ./src/tests/testOperations.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   testCompounds: () => (/* binding */ testCompounds),
/* harmony export */   testDifference: () => (/* binding */ testDifference),
/* harmony export */   testUnion: () => (/* binding */ testUnion)
/* harmony export */ });
/* harmony import */ var _common_geometry_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../common/geometry.js */ "./src/common/geometry.js");

function testUnion() {
    var box = _common_geometry_js__WEBPACK_IMPORTED_MODULE_0__["default"].makeBox(0, 0, 0, 10, 20, 30);
    // console.log("box: ",box);
    var sphere = _common_geometry_js__WEBPACK_IMPORTED_MODULE_0__["default"].makeSphere(0, 0, 0, 15);
    // console.log("sphere: ",sphere);
    var union = _common_geometry_js__WEBPACK_IMPORTED_MODULE_0__["default"].booleans.makeUnion([box, sphere], true);
    // console.log("union: ",union);
    return union;
}
function testDifference() {
    var box = _common_geometry_js__WEBPACK_IMPORTED_MODULE_0__["default"].makeBox(0, 0, 0, 10, 20, 30);
    //// console.log("box: ",box);
    var sphere = _common_geometry_js__WEBPACK_IMPORTED_MODULE_0__["default"].makeSphere(0, 0, 0, 15);
    //// console.log("sphere: ",sphere);
    var difference = _common_geometry_js__WEBPACK_IMPORTED_MODULE_0__["default"].makeDifference(box, [sphere], true);
    //// console.log("difference: ",difference);
    return difference;
}
function testCompounds() {
    var box0 = _common_geometry_js__WEBPACK_IMPORTED_MODULE_0__["default"].makeBox(0, 0, 0, 10, 20, 30);
    var box1 = _common_geometry_js__WEBPACK_IMPORTED_MODULE_0__["default"].makeBox(0, 0, 0, 40, 50, 60);
    var box2 = _common_geometry_js__WEBPACK_IMPORTED_MODULE_0__["default"].makeBox(0, 0, 0, 70, 80, 90);
    var box3 = _common_geometry_js__WEBPACK_IMPORTED_MODULE_0__["default"].makeBox(0, 0, 0, 100, 110, 120);
    var compound0 = _common_geometry_js__WEBPACK_IMPORTED_MODULE_0__["default"].compounds.makeCompound([box0, box1]);
    var compound1 = _common_geometry_js__WEBPACK_IMPORTED_MODULE_0__["default"].compounds.makeCompound([box2, box3]);
    var compoundOfCompounds = _common_geometry_js__WEBPACK_IMPORTED_MODULE_0__["default"].compounds.makeCompound([compound0, compound1]);
    // console.log("compoundOfCompounds is: ",compoundOfCompounds)
    // console.log("compoundOfCompounds type is: ",geometry.shapes.getShapeTypeAsString(compoundOfCompounds));
    var listed = _common_geometry_js__WEBPACK_IMPORTED_MODULE_0__["default"].compounds.listCompoundShapes(compoundOfCompounds, _common_geometry_js__WEBPACK_IMPORTED_MODULE_0__["default"].openCascade.TopAbs_ShapeEnum.TopAbs_COMPOUND);
    // console.log("listed type is: ",listed);
}


/***/ }),

/***/ "./node_modules/opencascade.js/dist/index.js":
/*!***************************************************!*\
  !*** ./node_modules/opencascade.js/dist/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _opencascade_full_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./opencascade.full.js */ "./node_modules/opencascade.js/dist/opencascade.full.js");
/* harmony import */ var _opencascade_full_wasm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./opencascade.full.wasm */ "./node_modules/opencascade.js/dist/opencascade.full.wasm");



const initOpenCascade = ({
  mainJS = _opencascade_full_js__WEBPACK_IMPORTED_MODULE_0__["default"],
  mainWasm = _opencascade_full_wasm__WEBPACK_IMPORTED_MODULE_1__["default"],
  worker = undefined,
  libs = [],
  module = {},
} = {}) => {
  return new Promise((resolve, reject) => {
    new mainJS({
      locateFile(path) {
        if (path.endsWith('.wasm')) {
          return mainWasm;
        }
        if (path.endsWith('.worker.js') && !!worker) {
          return worker;
        }
        return path;
      },
      ...module
    }).then(async oc => {
      for (let lib of libs) {
        await oc.loadDynamicLibrary(lib, { loadAsync: true, global: true, nodelete: true, allowUndefined: false });
      }
      resolve(oc);
    });
  });
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (initOpenCascade);


/***/ }),

/***/ "./node_modules/opencascade.js/dist/opencascade.full.js":
/*!**************************************************************!*\
  !*** ./node_modules/opencascade.js/dist/opencascade.full.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });

var Module = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
  return (
function(Module) {
  Module = Module || {};

var Module=typeof Module!="undefined"?Module:{};var readyPromiseResolve,readyPromiseReject;Module["ready"]=new Promise(function(resolve,reject){readyPromiseResolve=resolve;readyPromiseReject=reject});var moduleOverrides=Object.assign({},Module);var arguments_=[];var thisProgram="./this.program";var quit_=(status,toThrow)=>{throw toThrow};var ENVIRONMENT_IS_WEB=typeof window=="object";var ENVIRONMENT_IS_WORKER=typeof importScripts=="function";var ENVIRONMENT_IS_NODE=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string";var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var read_,readAsync,readBinary,setWindowTitle;function logExceptionOnExit(e){if(e instanceof ExitStatus)return;let toLog=e;err("exiting due to exception: "+toLog)}var fs;var nodePath;var requireNodeFS;if(ENVIRONMENT_IS_NODE){if(ENVIRONMENT_IS_WORKER){scriptDirectory=require("path").dirname(scriptDirectory)+"/"}else{scriptDirectory=__dirname+"/"}requireNodeFS=()=>{if(!nodePath){fs=require("fs");nodePath=require("path")}};read_=function shell_read(filename,binary){requireNodeFS();filename=nodePath["normalize"](filename);return fs.readFileSync(filename,binary?undefined:"utf8")};readBinary=filename=>{var ret=read_(filename,true);if(!ret.buffer){ret=new Uint8Array(ret)}return ret};readAsync=(filename,onload,onerror)=>{requireNodeFS();filename=nodePath["normalize"](filename);fs.readFile(filename,function(err,data){if(err)onerror(err);else onload(data.buffer)})};if(process["argv"].length>1){thisProgram=process["argv"][1].replace(/\\/g,"/")}arguments_=process["argv"].slice(2);process["on"]("uncaughtException",function(ex){if(!(ex instanceof ExitStatus)){throw ex}});process["on"]("unhandledRejection",function(reason){throw reason});quit_=(status,toThrow)=>{if(keepRuntimeAlive()){process["exitCode"]=status;throw toThrow}logExceptionOnExit(toThrow);process["exit"](status)};Module["inspect"]=function(){return"[Emscripten Module object]"}}else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WORKER){scriptDirectory=self.location.href}else if(typeof document!="undefined"&&document.currentScript){scriptDirectory=document.currentScript.src}if(_scriptDir){scriptDirectory=_scriptDir}if(scriptDirectory.indexOf("blob:")!==0){scriptDirectory=scriptDirectory.substr(0,scriptDirectory.replace(/[?#].*/,"").lastIndexOf("/")+1)}else{scriptDirectory=""}{read_=url=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText};if(ENVIRONMENT_IS_WORKER){readBinary=url=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}}readAsync=(url,onload,onerror)=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=()=>{if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}onerror()};xhr.onerror=onerror;xhr.send(null)}}setWindowTitle=title=>document.title=title}else{}var out=Module["print"]||console.log.bind(console);var err=Module["printErr"]||console.warn.bind(console);Object.assign(Module,moduleOverrides);moduleOverrides=null;if(Module["arguments"])arguments_=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"];if(Module["quit"])quit_=Module["quit"];var POINTER_SIZE=4;function warnOnce(text){if(!warnOnce.shown)warnOnce.shown={};if(!warnOnce.shown[text]){warnOnce.shown[text]=1;err(text)}}var tempRet0=0;var setTempRet0=value=>{tempRet0=value};var getTempRet0=()=>tempRet0;var wasmBinary;if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];var noExitRuntime=Module["noExitRuntime"]||true;if(typeof WebAssembly!="object"){abort("no native wasm support detected")}var wasmMemory;var ABORT=false;var EXITSTATUS;function assert(condition,text){if(!condition){abort(text)}}var UTF8Decoder=typeof TextDecoder!="undefined"?new TextDecoder("utf8"):undefined;function UTF8ArrayToString(heapOrArray,idx,maxBytesToRead){idx>>>=0;var endIdx=idx+maxBytesToRead;var endPtr=idx;while(heapOrArray[endPtr]&&!(endPtr>=endIdx))++endPtr;if(endPtr-idx>16&&heapOrArray.buffer&&UTF8Decoder){return UTF8Decoder.decode(heapOrArray.subarray(idx,endPtr))}else{var str="";while(idx<endPtr){var u0=heapOrArray[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heapOrArray[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=heapOrArray[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{u0=(u0&7)<<18|u1<<12|u2<<6|heapOrArray[idx++]&63}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}}return str}function UTF8ToString(ptr,maxBytesToRead){ptr>>>=0;return ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):""}function stringToUTF8Array(str,heap,outIdx,maxBytesToWrite){outIdx>>>=0;if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343){var u1=str.charCodeAt(++i);u=65536+((u&1023)<<10)|u1&1023}if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++>>>0]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++>>>0]=192|u>>6;heap[outIdx++>>>0]=128|u&63}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++>>>0]=224|u>>12;heap[outIdx++>>>0]=128|u>>6&63;heap[outIdx++>>>0]=128|u&63}else{if(outIdx+3>=endIdx)break;heap[outIdx++>>>0]=240|u>>18;heap[outIdx++>>>0]=128|u>>12&63;heap[outIdx++>>>0]=128|u>>6&63;heap[outIdx++>>>0]=128|u&63}}heap[outIdx>>>0]=0;return outIdx-startIdx}function stringToUTF8(str,outPtr,maxBytesToWrite){return stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite)}function lengthBytesUTF8(str){var len=0;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343)u=65536+((u&1023)<<10)|str.charCodeAt(++i)&1023;if(u<=127)++len;else if(u<=2047)len+=2;else if(u<=65535)len+=3;else len+=4}return len}var UTF16Decoder=typeof TextDecoder!="undefined"?new TextDecoder("utf-16le"):undefined;function UTF16ToString(ptr,maxBytesToRead){var endPtr=ptr;var idx=endPtr>>1;var maxIdx=idx+maxBytesToRead/2;while(!(idx>=maxIdx)&&HEAPU16[idx>>>0])++idx;endPtr=idx<<1;if(endPtr-ptr>32&&UTF16Decoder){return UTF16Decoder.decode(HEAPU8.subarray(ptr>>>0,endPtr>>>0))}else{var str="";for(var i=0;!(i>=maxBytesToRead/2);++i){var codeUnit=HEAP16[ptr+i*2>>>1];if(codeUnit==0)break;str+=String.fromCharCode(codeUnit)}return str}}function stringToUTF16(str,outPtr,maxBytesToWrite){if(maxBytesToWrite===undefined){maxBytesToWrite=2147483647}if(maxBytesToWrite<2)return 0;maxBytesToWrite-=2;var startPtr=outPtr;var numCharsToWrite=maxBytesToWrite<str.length*2?maxBytesToWrite/2:str.length;for(var i=0;i<numCharsToWrite;++i){var codeUnit=str.charCodeAt(i);HEAP16[outPtr>>>1]=codeUnit;outPtr+=2}HEAP16[outPtr>>>1]=0;return outPtr-startPtr}function lengthBytesUTF16(str){return str.length*2}function UTF32ToString(ptr,maxBytesToRead){var i=0;var str="";while(!(i>=maxBytesToRead/4)){var utf32=HEAP32[ptr+i*4>>>2];if(utf32==0)break;++i;if(utf32>=65536){var ch=utf32-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}else{str+=String.fromCharCode(utf32)}}return str}function stringToUTF32(str,outPtr,maxBytesToWrite){outPtr>>>=0;if(maxBytesToWrite===undefined){maxBytesToWrite=2147483647}if(maxBytesToWrite<4)return 0;var startPtr=outPtr;var endPtr=startPtr+maxBytesToWrite-4;for(var i=0;i<str.length;++i){var codeUnit=str.charCodeAt(i);if(codeUnit>=55296&&codeUnit<=57343){var trailSurrogate=str.charCodeAt(++i);codeUnit=65536+((codeUnit&1023)<<10)|trailSurrogate&1023}HEAP32[outPtr>>>2]=codeUnit;outPtr+=4;if(outPtr+4>endPtr)break}HEAP32[outPtr>>>2]=0;return outPtr-startPtr}function lengthBytesUTF32(str){var len=0;for(var i=0;i<str.length;++i){var codeUnit=str.charCodeAt(i);if(codeUnit>=55296&&codeUnit<=57343)++i;len+=4}return len}function allocateUTF8(str){var size=lengthBytesUTF8(str)+1;var ret=_malloc(size);if(ret)stringToUTF8Array(str,HEAP8,ret,size);return ret}function writeArrayToMemory(array,buffer){HEAP8.set(array,buffer>>>0)}function writeAsciiToMemory(str,buffer,dontAddNull){for(var i=0;i<str.length;++i){HEAP8[buffer++>>>0]=str.charCodeAt(i)}if(!dontAddNull)HEAP8[buffer>>>0]=0}var buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateGlobalBufferAndViews(buf){buffer=buf;Module["HEAP8"]=HEAP8=new Int8Array(buf);Module["HEAP16"]=HEAP16=new Int16Array(buf);Module["HEAP32"]=HEAP32=new Int32Array(buf);Module["HEAPU8"]=HEAPU8=new Uint8Array(buf);Module["HEAPU16"]=HEAPU16=new Uint16Array(buf);Module["HEAPU32"]=HEAPU32=new Uint32Array(buf);Module["HEAPF32"]=HEAPF32=new Float32Array(buf);Module["HEAPF64"]=HEAPF64=new Float64Array(buf)}var INITIAL_MEMORY=Module["INITIAL_MEMORY"]||104857600;var wasmTable;var __ATPRERUN__=[];var __ATINIT__=[];var __ATEXIT__=[];var __ATPOSTRUN__=[];var runtimeInitialized=false;function keepRuntimeAlive(){return noExitRuntime}function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function initRuntime(){runtimeInitialized=true;if(!Module["noFSInit"]&&!FS.init.initialized)FS.init();FS.ignorePermissions=false;TTY.init();callRuntimeCallbacks(__ATINIT__)}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}function addOnInit(cb){__ATINIT__.unshift(cb)}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;function getUniqueRunDependency(id){return id}function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}function abort(what){{if(Module["onAbort"]){Module["onAbort"](what)}}what="Aborted("+what+")";err(what);ABORT=true;EXITSTATUS=1;what+=". Build with -sASSERTIONS for more info.";var e=new WebAssembly.RuntimeError(what);readyPromiseReject(e);throw e}var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return filename.startsWith(dataURIPrefix)}function isFileURI(filename){return filename.startsWith("file://")}var wasmBinaryFile;wasmBinaryFile="opencascade.full.wasm";if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile)}function getBinary(file){try{if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}if(readBinary){return readBinary(file)}else{throw"both async and sync fetching of the wasm failed"}}catch(err){abort(err)}}function getBinaryPromise(){if(!wasmBinary&&(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)){if(typeof fetch=="function"&&!isFileURI(wasmBinaryFile)){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){if(!response["ok"]){throw"failed to load wasm binary file at '"+wasmBinaryFile+"'"}return response["arrayBuffer"]()}).catch(function(){return getBinary(wasmBinaryFile)})}else{if(readAsync){return new Promise(function(resolve,reject){readAsync(wasmBinaryFile,function(response){resolve(new Uint8Array(response))},reject)})}}}return Promise.resolve().then(function(){return getBinary(wasmBinaryFile)})}function createWasm(){var info={"a":asmLibraryArg};function receiveInstance(instance,module){var exports=instance.exports;Module["asm"]=exports;wasmMemory=Module["asm"]["xt"];updateGlobalBufferAndViews(wasmMemory.buffer);wasmTable=Module["asm"]["Et"];addOnInit(Module["asm"]["yt"]);removeRunDependency("wasm-instantiate")}addRunDependency("wasm-instantiate");function receiveInstantiationResult(result){receiveInstance(result["instance"])}function instantiateArrayBuffer(receiver){return getBinaryPromise().then(function(binary){return WebAssembly.instantiate(binary,info)}).then(function(instance){return instance}).then(receiver,function(reason){err("failed to asynchronously prepare wasm: "+reason);abort(reason)})}function instantiateAsync(){if(!wasmBinary&&typeof WebAssembly.instantiateStreaming=="function"&&!isDataURI(wasmBinaryFile)&&!isFileURI(wasmBinaryFile)&&!ENVIRONMENT_IS_NODE&&typeof fetch=="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){var result=WebAssembly.instantiateStreaming(response,info);return result.then(receiveInstantiationResult,function(reason){err("wasm streaming compile failed: "+reason);err("falling back to ArrayBuffer instantiation");return instantiateArrayBuffer(receiveInstantiationResult)})})}else{return instantiateArrayBuffer(receiveInstantiationResult)}}if(Module["instantiateWasm"]){try{var exports=Module["instantiateWasm"](info,receiveInstance);return exports}catch(e){err("Module.instantiateWasm callback failed with error: "+e);return false}}instantiateAsync().catch(readyPromiseReject);return{}}var tempDouble;var tempI64;var ASM_CONSTS={12467924:($0,$1,$2,$3)=>{Module.ctx.getBufferSubData($0,$1,HEAPU8.subarray($2>>>0,$2+$3>>>0))}};function OSD_MemInfo_getModuleHeapLength(){return Module.HEAP8.length}function occJSConsoleDebug(theStr){console.debug(UTF8ToString(theStr))}function occJSConsoleError(theStr){console.error(UTF8ToString(theStr))}function occJSConsoleInfo(theStr){console.info(UTF8ToString(theStr))}function occJSConsoleWarn(theStr){console.warn(UTF8ToString(theStr))}function callRuntimeCallbacks(callbacks){while(callbacks.length>0){var callback=callbacks.shift();if(typeof callback=="function"){callback(Module);continue}var func=callback.func;if(typeof func=="number"){if(callback.arg===undefined){getWasmTableEntry(func)()}else{getWasmTableEntry(func)(callback.arg)}}else{func(callback.arg===undefined?null:callback.arg)}}}var wasmTableMirror=[];function getWasmTableEntry(funcPtr){var func=wasmTableMirror[funcPtr];if(!func){if(funcPtr>=wasmTableMirror.length)wasmTableMirror.length=funcPtr+1;wasmTableMirror[funcPtr]=func=wasmTable.get(funcPtr)}return func}function handleException(e){if(e instanceof ExitStatus||e=="unwind"){return EXITSTATUS}quit_(1,e)}function jsStackTrace(){var error=new Error;if(!error.stack){try{throw new Error}catch(e){error=e}if(!error.stack){return"(no stack trace available)"}}return error.stack.toString()}function ___assert_fail(condition,filename,line,func){abort("Assertion failed: "+UTF8ToString(condition)+", at: "+[filename?UTF8ToString(filename):"unknown filename",line,func?UTF8ToString(func):"unknown function"])}function ___call_sighandler(fp,sig){getWasmTableEntry(fp)(sig)}function ___cxa_allocate_exception(size){return _malloc(size+24)+24}var exceptionCaught=[];function exception_addRef(info){info.add_ref()}var uncaughtExceptionCount=0;function ___cxa_begin_catch(ptr){var info=new ExceptionInfo(ptr);if(!info.get_caught()){info.set_caught(true);uncaughtExceptionCount--}info.set_rethrown(false);exceptionCaught.push(info);exception_addRef(info);return info.get_exception_ptr()}var exceptionLast=0;function ExceptionInfo(excPtr){this.excPtr=excPtr;this.ptr=excPtr-24;this.set_type=function(type){HEAPU32[this.ptr+4>>>2]=type};this.get_type=function(){return HEAPU32[this.ptr+4>>>2]};this.set_destructor=function(destructor){HEAPU32[this.ptr+8>>>2]=destructor};this.get_destructor=function(){return HEAPU32[this.ptr+8>>>2]};this.set_refcount=function(refcount){HEAP32[this.ptr>>>2]=refcount};this.set_caught=function(caught){caught=caught?1:0;HEAP8[this.ptr+12>>>0]=caught};this.get_caught=function(){return HEAP8[this.ptr+12>>>0]!=0};this.set_rethrown=function(rethrown){rethrown=rethrown?1:0;HEAP8[this.ptr+13>>>0]=rethrown};this.get_rethrown=function(){return HEAP8[this.ptr+13>>>0]!=0};this.init=function(type,destructor){this.set_adjusted_ptr(0);this.set_type(type);this.set_destructor(destructor);this.set_refcount(0);this.set_caught(false);this.set_rethrown(false)};this.add_ref=function(){var value=HEAP32[this.ptr>>>2];HEAP32[this.ptr>>>2]=value+1};this.release_ref=function(){var prev=HEAP32[this.ptr>>>2];HEAP32[this.ptr>>>2]=prev-1;return prev===1};this.set_adjusted_ptr=function(adjustedPtr){HEAPU32[this.ptr+16>>>2]=adjustedPtr};this.get_adjusted_ptr=function(){return HEAPU32[this.ptr+16>>>2]};this.get_exception_ptr=function(){var isPointer=___cxa_is_pointer_type(this.get_type());if(isPointer){return HEAPU32[this.excPtr>>>2]}var adjusted=this.get_adjusted_ptr();if(adjusted!==0)return adjusted;return this.excPtr}}function ___cxa_free_exception(ptr){return _free(new ExceptionInfo(ptr).ptr)}function exception_decRef(info){if(info.release_ref()&&!info.get_rethrown()){var destructor=info.get_destructor();if(destructor){getWasmTableEntry(destructor)(info.excPtr)}___cxa_free_exception(info.excPtr)}}function ___cxa_end_catch(){_setThrew(0);var info=exceptionCaught.pop();exception_decRef(info);exceptionLast=0}function ___resumeException(ptr){if(!exceptionLast){exceptionLast=ptr}throw ptr}function ___cxa_find_matching_catch_2(){var thrown=exceptionLast;if(!thrown){setTempRet0(0);return 0}var info=new ExceptionInfo(thrown);info.set_adjusted_ptr(thrown);var thrownType=info.get_type();if(!thrownType){setTempRet0(0);return thrown}var typeArray=Array.prototype.slice.call(arguments);for(var i=0;i<typeArray.length;i++){var caughtType=typeArray[i];if(caughtType===0||caughtType===thrownType){break}var adjusted_ptr_addr=info.ptr+16;if(___cxa_can_catch(caughtType,thrownType,adjusted_ptr_addr)){setTempRet0(caughtType);return thrown}}setTempRet0(thrownType);return thrown}function ___cxa_find_matching_catch_3(){var thrown=exceptionLast;if(!thrown){setTempRet0(0);return 0}var info=new ExceptionInfo(thrown);info.set_adjusted_ptr(thrown);var thrownType=info.get_type();if(!thrownType){setTempRet0(0);return thrown}var typeArray=Array.prototype.slice.call(arguments);for(var i=0;i<typeArray.length;i++){var caughtType=typeArray[i];if(caughtType===0||caughtType===thrownType){break}var adjusted_ptr_addr=info.ptr+16;if(___cxa_can_catch(caughtType,thrownType,adjusted_ptr_addr)){setTempRet0(caughtType);return thrown}}setTempRet0(thrownType);return thrown}function ___cxa_find_matching_catch_4(){var thrown=exceptionLast;if(!thrown){setTempRet0(0);return 0}var info=new ExceptionInfo(thrown);info.set_adjusted_ptr(thrown);var thrownType=info.get_type();if(!thrownType){setTempRet0(0);return thrown}var typeArray=Array.prototype.slice.call(arguments);for(var i=0;i<typeArray.length;i++){var caughtType=typeArray[i];if(caughtType===0||caughtType===thrownType){break}var adjusted_ptr_addr=info.ptr+16;if(___cxa_can_catch(caughtType,thrownType,adjusted_ptr_addr)){setTempRet0(caughtType);return thrown}}setTempRet0(thrownType);return thrown}function ___cxa_find_matching_catch_5(){var thrown=exceptionLast;if(!thrown){setTempRet0(0);return 0}var info=new ExceptionInfo(thrown);info.set_adjusted_ptr(thrown);var thrownType=info.get_type();if(!thrownType){setTempRet0(0);return thrown}var typeArray=Array.prototype.slice.call(arguments);for(var i=0;i<typeArray.length;i++){var caughtType=typeArray[i];if(caughtType===0||caughtType===thrownType){break}var adjusted_ptr_addr=info.ptr+16;if(___cxa_can_catch(caughtType,thrownType,adjusted_ptr_addr)){setTempRet0(caughtType);return thrown}}setTempRet0(thrownType);return thrown}function ___cxa_rethrow(){var info=exceptionCaught.pop();if(!info){abort("no exception to throw")}var ptr=info.excPtr;if(!info.get_rethrown()){exceptionCaught.push(info);info.set_rethrown(true);info.set_caught(false);uncaughtExceptionCount++}exceptionLast=ptr;throw ptr}function ___cxa_throw(ptr,type,destructor){var info=new ExceptionInfo(ptr);info.init(type,destructor);exceptionLast=ptr;uncaughtExceptionCount++;throw ptr}function ___cxa_uncaught_exceptions(){return uncaughtExceptionCount}var PATH={isAbs:path=>path.charAt(0)==="/",splitPath:filename=>{var splitPathRe=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;return splitPathRe.exec(filename).slice(1)},normalizeArray:(parts,allowAboveRoot)=>{var up=0;for(var i=parts.length-1;i>=0;i--){var last=parts[i];if(last==="."){parts.splice(i,1)}else if(last===".."){parts.splice(i,1);up++}else if(up){parts.splice(i,1);up--}}if(allowAboveRoot){for(;up;up--){parts.unshift("..")}}return parts},normalize:path=>{var isAbsolute=PATH.isAbs(path),trailingSlash=path.substr(-1)==="/";path=PATH.normalizeArray(path.split("/").filter(p=>!!p),!isAbsolute).join("/");if(!path&&!isAbsolute){path="."}if(path&&trailingSlash){path+="/"}return(isAbsolute?"/":"")+path},dirname:path=>{var result=PATH.splitPath(path),root=result[0],dir=result[1];if(!root&&!dir){return"."}if(dir){dir=dir.substr(0,dir.length-1)}return root+dir},basename:path=>{if(path==="/")return"/";path=PATH.normalize(path);path=path.replace(/\/$/,"");var lastSlash=path.lastIndexOf("/");if(lastSlash===-1)return path;return path.substr(lastSlash+1)},join:function(){var paths=Array.prototype.slice.call(arguments,0);return PATH.normalize(paths.join("/"))},join2:(l,r)=>{return PATH.normalize(l+"/"+r)}};function getRandomDevice(){if(typeof crypto=="object"&&typeof crypto["getRandomValues"]=="function"){var randomBuffer=new Uint8Array(1);return function(){crypto.getRandomValues(randomBuffer);return randomBuffer[0]}}else if(ENVIRONMENT_IS_NODE){try{var crypto_module=require("crypto");return function(){return crypto_module["randomBytes"](1)[0]}}catch(e){}}return function(){abort("randomDevice")}}var PATH_FS={resolve:function(){var resolvedPath="",resolvedAbsolute=false;for(var i=arguments.length-1;i>=-1&&!resolvedAbsolute;i--){var path=i>=0?arguments[i]:FS.cwd();if(typeof path!="string"){throw new TypeError("Arguments to path.resolve must be strings")}else if(!path){return""}resolvedPath=path+"/"+resolvedPath;resolvedAbsolute=PATH.isAbs(path)}resolvedPath=PATH.normalizeArray(resolvedPath.split("/").filter(p=>!!p),!resolvedAbsolute).join("/");return(resolvedAbsolute?"/":"")+resolvedPath||"."},relative:(from,to)=>{from=PATH_FS.resolve(from).substr(1);to=PATH_FS.resolve(to).substr(1);function trim(arr){var start=0;for(;start<arr.length;start++){if(arr[start]!=="")break}var end=arr.length-1;for(;end>=0;end--){if(arr[end]!=="")break}if(start>end)return[];return arr.slice(start,end-start+1)}var fromParts=trim(from.split("/"));var toParts=trim(to.split("/"));var length=Math.min(fromParts.length,toParts.length);var samePartsLength=length;for(var i=0;i<length;i++){if(fromParts[i]!==toParts[i]){samePartsLength=i;break}}var outputParts=[];for(var i=samePartsLength;i<fromParts.length;i++){outputParts.push("..")}outputParts=outputParts.concat(toParts.slice(samePartsLength));return outputParts.join("/")}};var TTY={ttys:[],init:function(){},shutdown:function(){},register:function(dev,ops){TTY.ttys[dev]={input:[],output:[],ops:ops};FS.registerDevice(dev,TTY.stream_ops)},stream_ops:{open:function(stream){var tty=TTY.ttys[stream.node.rdev];if(!tty){throw new FS.ErrnoError(43)}stream.tty=tty;stream.seekable=false},close:function(stream){stream.tty.ops.flush(stream.tty)},flush:function(stream){stream.tty.ops.flush(stream.tty)},read:function(stream,buffer,offset,length,pos){if(!stream.tty||!stream.tty.ops.get_char){throw new FS.ErrnoError(60)}var bytesRead=0;for(var i=0;i<length;i++){var result;try{result=stream.tty.ops.get_char(stream.tty)}catch(e){throw new FS.ErrnoError(29)}if(result===undefined&&bytesRead===0){throw new FS.ErrnoError(6)}if(result===null||result===undefined)break;bytesRead++;buffer[offset+i]=result}if(bytesRead){stream.node.timestamp=Date.now()}return bytesRead},write:function(stream,buffer,offset,length,pos){if(!stream.tty||!stream.tty.ops.put_char){throw new FS.ErrnoError(60)}try{for(var i=0;i<length;i++){stream.tty.ops.put_char(stream.tty,buffer[offset+i])}}catch(e){throw new FS.ErrnoError(29)}if(length){stream.node.timestamp=Date.now()}return i}},default_tty_ops:{get_char:function(tty){if(!tty.input.length){var result=null;if(ENVIRONMENT_IS_NODE){var BUFSIZE=256;var buf=Buffer.alloc(BUFSIZE);var bytesRead=0;try{bytesRead=fs.readSync(process.stdin.fd,buf,0,BUFSIZE,-1)}catch(e){if(e.toString().includes("EOF"))bytesRead=0;else throw e}if(bytesRead>0){result=buf.slice(0,bytesRead).toString("utf-8")}else{result=null}}else if(typeof window!="undefined"&&typeof window.prompt=="function"){result=window.prompt("Input: ");if(result!==null){result+="\n"}}else if(typeof readline=="function"){result=readline();if(result!==null){result+="\n"}}if(!result){return null}tty.input=intArrayFromString(result,true)}return tty.input.shift()},put_char:function(tty,val){if(val===null||val===10){out(UTF8ArrayToString(tty.output,0));tty.output=[]}else{if(val!=0)tty.output.push(val)}},flush:function(tty){if(tty.output&&tty.output.length>0){out(UTF8ArrayToString(tty.output,0));tty.output=[]}}},default_tty1_ops:{put_char:function(tty,val){if(val===null||val===10){err(UTF8ArrayToString(tty.output,0));tty.output=[]}else{if(val!=0)tty.output.push(val)}},flush:function(tty){if(tty.output&&tty.output.length>0){err(UTF8ArrayToString(tty.output,0));tty.output=[]}}}};function zeroMemory(address,size){HEAPU8.fill(0,address,address+size)}function alignMemory(size,alignment){return Math.ceil(size/alignment)*alignment}function mmapAlloc(size){size=alignMemory(size,65536);var ptr=_emscripten_builtin_memalign(65536,size);if(!ptr)return 0;zeroMemory(ptr,size);return ptr}var MEMFS={ops_table:null,mount:function(mount){return MEMFS.createNode(null,"/",16384|511,0)},createNode:function(parent,name,mode,dev){if(FS.isBlkdev(mode)||FS.isFIFO(mode)){throw new FS.ErrnoError(63)}if(!MEMFS.ops_table){MEMFS.ops_table={dir:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr,lookup:MEMFS.node_ops.lookup,mknod:MEMFS.node_ops.mknod,rename:MEMFS.node_ops.rename,unlink:MEMFS.node_ops.unlink,rmdir:MEMFS.node_ops.rmdir,readdir:MEMFS.node_ops.readdir,symlink:MEMFS.node_ops.symlink},stream:{llseek:MEMFS.stream_ops.llseek}},file:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr},stream:{llseek:MEMFS.stream_ops.llseek,read:MEMFS.stream_ops.read,write:MEMFS.stream_ops.write,allocate:MEMFS.stream_ops.allocate,mmap:MEMFS.stream_ops.mmap,msync:MEMFS.stream_ops.msync}},link:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr,readlink:MEMFS.node_ops.readlink},stream:{}},chrdev:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr},stream:FS.chrdev_stream_ops}}}var node=FS.createNode(parent,name,mode,dev);if(FS.isDir(node.mode)){node.node_ops=MEMFS.ops_table.dir.node;node.stream_ops=MEMFS.ops_table.dir.stream;node.contents={}}else if(FS.isFile(node.mode)){node.node_ops=MEMFS.ops_table.file.node;node.stream_ops=MEMFS.ops_table.file.stream;node.usedBytes=0;node.contents=null}else if(FS.isLink(node.mode)){node.node_ops=MEMFS.ops_table.link.node;node.stream_ops=MEMFS.ops_table.link.stream}else if(FS.isChrdev(node.mode)){node.node_ops=MEMFS.ops_table.chrdev.node;node.stream_ops=MEMFS.ops_table.chrdev.stream}node.timestamp=Date.now();if(parent){parent.contents[name]=node;parent.timestamp=node.timestamp}return node},getFileDataAsTypedArray:function(node){if(!node.contents)return new Uint8Array(0);if(node.contents.subarray)return node.contents.subarray(0,node.usedBytes);return new Uint8Array(node.contents)},expandFileStorage:function(node,newCapacity){newCapacity>>>=0;var prevCapacity=node.contents?node.contents.length:0;if(prevCapacity>=newCapacity)return;var CAPACITY_DOUBLING_MAX=1024*1024;newCapacity=Math.max(newCapacity,prevCapacity*(prevCapacity<CAPACITY_DOUBLING_MAX?2:1.125)>>>0);if(prevCapacity!=0)newCapacity=Math.max(newCapacity,256);var oldContents=node.contents;node.contents=new Uint8Array(newCapacity);if(node.usedBytes>0)node.contents.set(oldContents.subarray(0,node.usedBytes),0)},resizeFileStorage:function(node,newSize){newSize>>>=0;if(node.usedBytes==newSize)return;if(newSize==0){node.contents=null;node.usedBytes=0}else{var oldContents=node.contents;node.contents=new Uint8Array(newSize);if(oldContents){node.contents.set(oldContents.subarray(0,Math.min(newSize,node.usedBytes)))}node.usedBytes=newSize}},node_ops:{getattr:function(node){var attr={};attr.dev=FS.isChrdev(node.mode)?node.id:1;attr.ino=node.id;attr.mode=node.mode;attr.nlink=1;attr.uid=0;attr.gid=0;attr.rdev=node.rdev;if(FS.isDir(node.mode)){attr.size=4096}else if(FS.isFile(node.mode)){attr.size=node.usedBytes}else if(FS.isLink(node.mode)){attr.size=node.link.length}else{attr.size=0}attr.atime=new Date(node.timestamp);attr.mtime=new Date(node.timestamp);attr.ctime=new Date(node.timestamp);attr.blksize=4096;attr.blocks=Math.ceil(attr.size/attr.blksize);return attr},setattr:function(node,attr){if(attr.mode!==undefined){node.mode=attr.mode}if(attr.timestamp!==undefined){node.timestamp=attr.timestamp}if(attr.size!==undefined){MEMFS.resizeFileStorage(node,attr.size)}},lookup:function(parent,name){throw FS.genericErrors[44]},mknod:function(parent,name,mode,dev){return MEMFS.createNode(parent,name,mode,dev)},rename:function(old_node,new_dir,new_name){if(FS.isDir(old_node.mode)){var new_node;try{new_node=FS.lookupNode(new_dir,new_name)}catch(e){}if(new_node){for(var i in new_node.contents){throw new FS.ErrnoError(55)}}}delete old_node.parent.contents[old_node.name];old_node.parent.timestamp=Date.now();old_node.name=new_name;new_dir.contents[new_name]=old_node;new_dir.timestamp=old_node.parent.timestamp;old_node.parent=new_dir},unlink:function(parent,name){delete parent.contents[name];parent.timestamp=Date.now()},rmdir:function(parent,name){var node=FS.lookupNode(parent,name);for(var i in node.contents){throw new FS.ErrnoError(55)}delete parent.contents[name];parent.timestamp=Date.now()},readdir:function(node){var entries=[".",".."];for(var key in node.contents){if(!node.contents.hasOwnProperty(key)){continue}entries.push(key)}return entries},symlink:function(parent,newname,oldpath){var node=MEMFS.createNode(parent,newname,511|40960,0);node.link=oldpath;return node},readlink:function(node){if(!FS.isLink(node.mode)){throw new FS.ErrnoError(28)}return node.link}},stream_ops:{read:function(stream,buffer,offset,length,position){var contents=stream.node.contents;if(position>=stream.node.usedBytes)return 0;var size=Math.min(stream.node.usedBytes-position,length);if(size>8&&contents.subarray){buffer.set(contents.subarray(position,position+size),offset)}else{for(var i=0;i<size;i++)buffer[offset+i]=contents[position+i]}return size},write:function(stream,buffer,offset,length,position,canOwn){if(buffer.buffer===HEAP8.buffer){canOwn=false}if(!length)return 0;var node=stream.node;node.timestamp=Date.now();if(buffer.subarray&&(!node.contents||node.contents.subarray)){if(canOwn){node.contents=buffer.subarray(offset,offset+length);node.usedBytes=length;return length}else if(node.usedBytes===0&&position===0){node.contents=buffer.slice(offset,offset+length);node.usedBytes=length;return length}else if(position+length<=node.usedBytes){node.contents.set(buffer.subarray(offset,offset+length),position);return length}}MEMFS.expandFileStorage(node,position+length);if(node.contents.subarray&&buffer.subarray){node.contents.set(buffer.subarray(offset,offset+length),position)}else{for(var i=0;i<length;i++){node.contents[position+i]=buffer[offset+i]}}node.usedBytes=Math.max(node.usedBytes,position+length);return length},llseek:function(stream,offset,whence){var position=offset;if(whence===1){position+=stream.position}else if(whence===2){if(FS.isFile(stream.node.mode)){position+=stream.node.usedBytes}}if(position<0){throw new FS.ErrnoError(28)}return position},allocate:function(stream,offset,length){MEMFS.expandFileStorage(stream.node,offset+length);stream.node.usedBytes=Math.max(stream.node.usedBytes,offset+length)},mmap:function(stream,length,position,prot,flags){if(!FS.isFile(stream.node.mode)){throw new FS.ErrnoError(43)}var ptr;var allocated;var contents=stream.node.contents;if(!(flags&2)&&contents.buffer===buffer){allocated=false;ptr=contents.byteOffset}else{if(position>0||position+length<contents.length){if(contents.subarray){contents=contents.subarray(position,position+length)}else{contents=Array.prototype.slice.call(contents,position,position+length)}}allocated=true;ptr=mmapAlloc(length);if(!ptr){throw new FS.ErrnoError(48)}ptr>>>=0;HEAP8.set(contents,ptr>>>0)}return{ptr:ptr,allocated:allocated}},msync:function(stream,buffer,offset,length,mmapFlags){if(!FS.isFile(stream.node.mode)){throw new FS.ErrnoError(43)}if(mmapFlags&2){return 0}var bytesWritten=MEMFS.stream_ops.write(stream,buffer,0,length,offset,false);return 0}}};function asyncLoad(url,onload,onerror,noRunDep){var dep=!noRunDep?getUniqueRunDependency("al "+url):"";readAsync(url,function(arrayBuffer){assert(arrayBuffer,'Loading data file "'+url+'" failed (no arrayBuffer).');onload(new Uint8Array(arrayBuffer));if(dep)removeRunDependency(dep)},function(event){if(onerror){onerror()}else{throw'Loading data file "'+url+'" failed.'}});if(dep)addRunDependency(dep)}var FS={root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,ErrnoError:null,genericErrors:{},filesystems:null,syncFSRequests:0,lookupPath:(path,opts={})=>{path=PATH_FS.resolve(FS.cwd(),path);if(!path)return{path:"",node:null};var defaults={follow_mount:true,recurse_count:0};opts=Object.assign(defaults,opts);if(opts.recurse_count>8){throw new FS.ErrnoError(32)}var parts=PATH.normalizeArray(path.split("/").filter(p=>!!p),false);var current=FS.root;var current_path="/";for(var i=0;i<parts.length;i++){var islast=i===parts.length-1;if(islast&&opts.parent){break}current=FS.lookupNode(current,parts[i]);current_path=PATH.join2(current_path,parts[i]);if(FS.isMountpoint(current)){if(!islast||islast&&opts.follow_mount){current=current.mounted.root}}if(!islast||opts.follow){var count=0;while(FS.isLink(current.mode)){var link=FS.readlink(current_path);current_path=PATH_FS.resolve(PATH.dirname(current_path),link);var lookup=FS.lookupPath(current_path,{recurse_count:opts.recurse_count+1});current=lookup.node;if(count++>40){throw new FS.ErrnoError(32)}}}}return{path:current_path,node:current}},getPath:node=>{var path;while(true){if(FS.isRoot(node)){var mount=node.mount.mountpoint;if(!path)return mount;return mount[mount.length-1]!=="/"?mount+"/"+path:mount+path}path=path?node.name+"/"+path:node.name;node=node.parent}},hashName:(parentid,name)=>{var hash=0;for(var i=0;i<name.length;i++){hash=(hash<<5)-hash+name.charCodeAt(i)|0}return(parentid+hash>>>0)%FS.nameTable.length},hashAddNode:node=>{var hash=FS.hashName(node.parent.id,node.name);node.name_next=FS.nameTable[hash];FS.nameTable[hash]=node},hashRemoveNode:node=>{var hash=FS.hashName(node.parent.id,node.name);if(FS.nameTable[hash]===node){FS.nameTable[hash]=node.name_next}else{var current=FS.nameTable[hash];while(current){if(current.name_next===node){current.name_next=node.name_next;break}current=current.name_next}}},lookupNode:(parent,name)=>{var errCode=FS.mayLookup(parent);if(errCode){throw new FS.ErrnoError(errCode,parent)}var hash=FS.hashName(parent.id,name);for(var node=FS.nameTable[hash];node;node=node.name_next){var nodeName=node.name;if(node.parent.id===parent.id&&nodeName===name){return node}}return FS.lookup(parent,name)},createNode:(parent,name,mode,rdev)=>{var node=new FS.FSNode(parent,name,mode,rdev);FS.hashAddNode(node);return node},destroyNode:node=>{FS.hashRemoveNode(node)},isRoot:node=>{return node===node.parent},isMountpoint:node=>{return!!node.mounted},isFile:mode=>{return(mode&61440)===32768},isDir:mode=>{return(mode&61440)===16384},isLink:mode=>{return(mode&61440)===40960},isChrdev:mode=>{return(mode&61440)===8192},isBlkdev:mode=>{return(mode&61440)===24576},isFIFO:mode=>{return(mode&61440)===4096},isSocket:mode=>{return(mode&49152)===49152},flagModes:{"r":0,"r+":2,"w":577,"w+":578,"a":1089,"a+":1090},modeStringToFlags:str=>{var flags=FS.flagModes[str];if(typeof flags=="undefined"){throw new Error("Unknown file open mode: "+str)}return flags},flagsToPermissionString:flag=>{var perms=["r","w","rw"][flag&3];if(flag&512){perms+="w"}return perms},nodePermissions:(node,perms)=>{if(FS.ignorePermissions){return 0}if(perms.includes("r")&&!(node.mode&292)){return 2}else if(perms.includes("w")&&!(node.mode&146)){return 2}else if(perms.includes("x")&&!(node.mode&73)){return 2}return 0},mayLookup:dir=>{var errCode=FS.nodePermissions(dir,"x");if(errCode)return errCode;if(!dir.node_ops.lookup)return 2;return 0},mayCreate:(dir,name)=>{try{var node=FS.lookupNode(dir,name);return 20}catch(e){}return FS.nodePermissions(dir,"wx")},mayDelete:(dir,name,isdir)=>{var node;try{node=FS.lookupNode(dir,name)}catch(e){return e.errno}var errCode=FS.nodePermissions(dir,"wx");if(errCode){return errCode}if(isdir){if(!FS.isDir(node.mode)){return 54}if(FS.isRoot(node)||FS.getPath(node)===FS.cwd()){return 10}}else{if(FS.isDir(node.mode)){return 31}}return 0},mayOpen:(node,flags)=>{if(!node){return 44}if(FS.isLink(node.mode)){return 32}else if(FS.isDir(node.mode)){if(FS.flagsToPermissionString(flags)!=="r"||flags&512){return 31}}return FS.nodePermissions(node,FS.flagsToPermissionString(flags))},MAX_OPEN_FDS:4096,nextfd:(fd_start=0,fd_end=FS.MAX_OPEN_FDS)=>{for(var fd=fd_start;fd<=fd_end;fd++){if(!FS.streams[fd]){return fd}}throw new FS.ErrnoError(33)},getStream:fd=>FS.streams[fd],createStream:(stream,fd_start,fd_end)=>{if(!FS.FSStream){FS.FSStream=function(){this.shared={}};FS.FSStream.prototype={};Object.defineProperties(FS.FSStream.prototype,{object:{get:function(){return this.node},set:function(val){this.node=val}},isRead:{get:function(){return(this.flags&2097155)!==1}},isWrite:{get:function(){return(this.flags&2097155)!==0}},isAppend:{get:function(){return this.flags&1024}},flags:{get:function(){return this.shared.flags},set:function(val){this.shared.flags=val}},position:{get:function(){return this.shared.position},set:function(val){this.shared.position=val}}})}stream=Object.assign(new FS.FSStream,stream);var fd=FS.nextfd(fd_start,fd_end);stream.fd=fd;FS.streams[fd]=stream;return stream},closeStream:fd=>{FS.streams[fd]=null},chrdev_stream_ops:{open:stream=>{var device=FS.getDevice(stream.node.rdev);stream.stream_ops=device.stream_ops;if(stream.stream_ops.open){stream.stream_ops.open(stream)}},llseek:()=>{throw new FS.ErrnoError(70)}},major:dev=>dev>>8,minor:dev=>dev&255,makedev:(ma,mi)=>ma<<8|mi,registerDevice:(dev,ops)=>{FS.devices[dev]={stream_ops:ops}},getDevice:dev=>FS.devices[dev],getMounts:mount=>{var mounts=[];var check=[mount];while(check.length){var m=check.pop();mounts.push(m);check.push.apply(check,m.mounts)}return mounts},syncfs:(populate,callback)=>{if(typeof populate=="function"){callback=populate;populate=false}FS.syncFSRequests++;if(FS.syncFSRequests>1){err("warning: "+FS.syncFSRequests+" FS.syncfs operations in flight at once, probably just doing extra work")}var mounts=FS.getMounts(FS.root.mount);var completed=0;function doCallback(errCode){FS.syncFSRequests--;return callback(errCode)}function done(errCode){if(errCode){if(!done.errored){done.errored=true;return doCallback(errCode)}return}if(++completed>=mounts.length){doCallback(null)}}mounts.forEach(mount=>{if(!mount.type.syncfs){return done(null)}mount.type.syncfs(mount,populate,done)})},mount:(type,opts,mountpoint)=>{var root=mountpoint==="/";var pseudo=!mountpoint;var node;if(root&&FS.root){throw new FS.ErrnoError(10)}else if(!root&&!pseudo){var lookup=FS.lookupPath(mountpoint,{follow_mount:false});mountpoint=lookup.path;node=lookup.node;if(FS.isMountpoint(node)){throw new FS.ErrnoError(10)}if(!FS.isDir(node.mode)){throw new FS.ErrnoError(54)}}var mount={type:type,opts:opts,mountpoint:mountpoint,mounts:[]};var mountRoot=type.mount(mount);mountRoot.mount=mount;mount.root=mountRoot;if(root){FS.root=mountRoot}else if(node){node.mounted=mount;if(node.mount){node.mount.mounts.push(mount)}}return mountRoot},unmount:mountpoint=>{var lookup=FS.lookupPath(mountpoint,{follow_mount:false});if(!FS.isMountpoint(lookup.node)){throw new FS.ErrnoError(28)}var node=lookup.node;var mount=node.mounted;var mounts=FS.getMounts(mount);Object.keys(FS.nameTable).forEach(hash=>{var current=FS.nameTable[hash];while(current){var next=current.name_next;if(mounts.includes(current.mount)){FS.destroyNode(current)}current=next}});node.mounted=null;var idx=node.mount.mounts.indexOf(mount);node.mount.mounts.splice(idx,1)},lookup:(parent,name)=>{return parent.node_ops.lookup(parent,name)},mknod:(path,mode,dev)=>{var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;var name=PATH.basename(path);if(!name||name==="."||name===".."){throw new FS.ErrnoError(28)}var errCode=FS.mayCreate(parent,name);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.mknod){throw new FS.ErrnoError(63)}return parent.node_ops.mknod(parent,name,mode,dev)},create:(path,mode)=>{mode=mode!==undefined?mode:438;mode&=4095;mode|=32768;return FS.mknod(path,mode,0)},mkdir:(path,mode)=>{mode=mode!==undefined?mode:511;mode&=511|512;mode|=16384;return FS.mknod(path,mode,0)},mkdirTree:(path,mode)=>{var dirs=path.split("/");var d="";for(var i=0;i<dirs.length;++i){if(!dirs[i])continue;d+="/"+dirs[i];try{FS.mkdir(d,mode)}catch(e){if(e.errno!=20)throw e}}},mkdev:(path,mode,dev)=>{if(typeof dev=="undefined"){dev=mode;mode=438}mode|=8192;return FS.mknod(path,mode,dev)},symlink:(oldpath,newpath)=>{if(!PATH_FS.resolve(oldpath)){throw new FS.ErrnoError(44)}var lookup=FS.lookupPath(newpath,{parent:true});var parent=lookup.node;if(!parent){throw new FS.ErrnoError(44)}var newname=PATH.basename(newpath);var errCode=FS.mayCreate(parent,newname);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.symlink){throw new FS.ErrnoError(63)}return parent.node_ops.symlink(parent,newname,oldpath)},rename:(old_path,new_path)=>{var old_dirname=PATH.dirname(old_path);var new_dirname=PATH.dirname(new_path);var old_name=PATH.basename(old_path);var new_name=PATH.basename(new_path);var lookup,old_dir,new_dir;lookup=FS.lookupPath(old_path,{parent:true});old_dir=lookup.node;lookup=FS.lookupPath(new_path,{parent:true});new_dir=lookup.node;if(!old_dir||!new_dir)throw new FS.ErrnoError(44);if(old_dir.mount!==new_dir.mount){throw new FS.ErrnoError(75)}var old_node=FS.lookupNode(old_dir,old_name);var relative=PATH_FS.relative(old_path,new_dirname);if(relative.charAt(0)!=="."){throw new FS.ErrnoError(28)}relative=PATH_FS.relative(new_path,old_dirname);if(relative.charAt(0)!=="."){throw new FS.ErrnoError(55)}var new_node;try{new_node=FS.lookupNode(new_dir,new_name)}catch(e){}if(old_node===new_node){return}var isdir=FS.isDir(old_node.mode);var errCode=FS.mayDelete(old_dir,old_name,isdir);if(errCode){throw new FS.ErrnoError(errCode)}errCode=new_node?FS.mayDelete(new_dir,new_name,isdir):FS.mayCreate(new_dir,new_name);if(errCode){throw new FS.ErrnoError(errCode)}if(!old_dir.node_ops.rename){throw new FS.ErrnoError(63)}if(FS.isMountpoint(old_node)||new_node&&FS.isMountpoint(new_node)){throw new FS.ErrnoError(10)}if(new_dir!==old_dir){errCode=FS.nodePermissions(old_dir,"w");if(errCode){throw new FS.ErrnoError(errCode)}}FS.hashRemoveNode(old_node);try{old_dir.node_ops.rename(old_node,new_dir,new_name)}catch(e){throw e}finally{FS.hashAddNode(old_node)}},rmdir:path=>{var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;var name=PATH.basename(path);var node=FS.lookupNode(parent,name);var errCode=FS.mayDelete(parent,name,true);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.rmdir){throw new FS.ErrnoError(63)}if(FS.isMountpoint(node)){throw new FS.ErrnoError(10)}parent.node_ops.rmdir(parent,name);FS.destroyNode(node)},readdir:path=>{var lookup=FS.lookupPath(path,{follow:true});var node=lookup.node;if(!node.node_ops.readdir){throw new FS.ErrnoError(54)}return node.node_ops.readdir(node)},unlink:path=>{var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;if(!parent){throw new FS.ErrnoError(44)}var name=PATH.basename(path);var node=FS.lookupNode(parent,name);var errCode=FS.mayDelete(parent,name,false);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.unlink){throw new FS.ErrnoError(63)}if(FS.isMountpoint(node)){throw new FS.ErrnoError(10)}parent.node_ops.unlink(parent,name);FS.destroyNode(node)},readlink:path=>{var lookup=FS.lookupPath(path);var link=lookup.node;if(!link){throw new FS.ErrnoError(44)}if(!link.node_ops.readlink){throw new FS.ErrnoError(28)}return PATH_FS.resolve(FS.getPath(link.parent),link.node_ops.readlink(link))},stat:(path,dontFollow)=>{var lookup=FS.lookupPath(path,{follow:!dontFollow});var node=lookup.node;if(!node){throw new FS.ErrnoError(44)}if(!node.node_ops.getattr){throw new FS.ErrnoError(63)}return node.node_ops.getattr(node)},lstat:path=>{return FS.stat(path,true)},chmod:(path,mode,dontFollow)=>{var node;if(typeof path=="string"){var lookup=FS.lookupPath(path,{follow:!dontFollow});node=lookup.node}else{node=path}if(!node.node_ops.setattr){throw new FS.ErrnoError(63)}node.node_ops.setattr(node,{mode:mode&4095|node.mode&~4095,timestamp:Date.now()})},lchmod:(path,mode)=>{FS.chmod(path,mode,true)},fchmod:(fd,mode)=>{var stream=FS.getStream(fd);if(!stream){throw new FS.ErrnoError(8)}FS.chmod(stream.node,mode)},chown:(path,uid,gid,dontFollow)=>{var node;if(typeof path=="string"){var lookup=FS.lookupPath(path,{follow:!dontFollow});node=lookup.node}else{node=path}if(!node.node_ops.setattr){throw new FS.ErrnoError(63)}node.node_ops.setattr(node,{timestamp:Date.now()})},lchown:(path,uid,gid)=>{FS.chown(path,uid,gid,true)},fchown:(fd,uid,gid)=>{var stream=FS.getStream(fd);if(!stream){throw new FS.ErrnoError(8)}FS.chown(stream.node,uid,gid)},truncate:(path,len)=>{if(len<0){throw new FS.ErrnoError(28)}var node;if(typeof path=="string"){var lookup=FS.lookupPath(path,{follow:true});node=lookup.node}else{node=path}if(!node.node_ops.setattr){throw new FS.ErrnoError(63)}if(FS.isDir(node.mode)){throw new FS.ErrnoError(31)}if(!FS.isFile(node.mode)){throw new FS.ErrnoError(28)}var errCode=FS.nodePermissions(node,"w");if(errCode){throw new FS.ErrnoError(errCode)}node.node_ops.setattr(node,{size:len,timestamp:Date.now()})},ftruncate:(fd,len)=>{var stream=FS.getStream(fd);if(!stream){throw new FS.ErrnoError(8)}if((stream.flags&2097155)===0){throw new FS.ErrnoError(28)}FS.truncate(stream.node,len)},utime:(path,atime,mtime)=>{var lookup=FS.lookupPath(path,{follow:true});var node=lookup.node;node.node_ops.setattr(node,{timestamp:Math.max(atime,mtime)})},open:(path,flags,mode)=>{if(path===""){throw new FS.ErrnoError(44)}flags=typeof flags=="string"?FS.modeStringToFlags(flags):flags;mode=typeof mode=="undefined"?438:mode;if(flags&64){mode=mode&4095|32768}else{mode=0}var node;if(typeof path=="object"){node=path}else{path=PATH.normalize(path);try{var lookup=FS.lookupPath(path,{follow:!(flags&131072)});node=lookup.node}catch(e){}}var created=false;if(flags&64){if(node){if(flags&128){throw new FS.ErrnoError(20)}}else{node=FS.mknod(path,mode,0);created=true}}if(!node){throw new FS.ErrnoError(44)}if(FS.isChrdev(node.mode)){flags&=~512}if(flags&65536&&!FS.isDir(node.mode)){throw new FS.ErrnoError(54)}if(!created){var errCode=FS.mayOpen(node,flags);if(errCode){throw new FS.ErrnoError(errCode)}}if(flags&512&&!created){FS.truncate(node,0)}flags&=~(128|512|131072);var stream=FS.createStream({node:node,path:FS.getPath(node),flags:flags,seekable:true,position:0,stream_ops:node.stream_ops,ungotten:[],error:false});if(stream.stream_ops.open){stream.stream_ops.open(stream)}if(Module["logReadFiles"]&&!(flags&1)){if(!FS.readFiles)FS.readFiles={};if(!(path in FS.readFiles)){FS.readFiles[path]=1}}return stream},close:stream=>{if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if(stream.getdents)stream.getdents=null;try{if(stream.stream_ops.close){stream.stream_ops.close(stream)}}catch(e){throw e}finally{FS.closeStream(stream.fd)}stream.fd=null},isClosed:stream=>{return stream.fd===null},llseek:(stream,offset,whence)=>{if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if(!stream.seekable||!stream.stream_ops.llseek){throw new FS.ErrnoError(70)}if(whence!=0&&whence!=1&&whence!=2){throw new FS.ErrnoError(28)}stream.position=stream.stream_ops.llseek(stream,offset,whence);stream.ungotten=[];return stream.position},read:(stream,buffer,offset,length,position)=>{offset>>>=0;if(length<0||position<0){throw new FS.ErrnoError(28)}if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if((stream.flags&2097155)===1){throw new FS.ErrnoError(8)}if(FS.isDir(stream.node.mode)){throw new FS.ErrnoError(31)}if(!stream.stream_ops.read){throw new FS.ErrnoError(28)}var seeking=typeof position!="undefined";if(!seeking){position=stream.position}else if(!stream.seekable){throw new FS.ErrnoError(70)}var bytesRead=stream.stream_ops.read(stream,buffer,offset,length,position);if(!seeking)stream.position+=bytesRead;return bytesRead},write:(stream,buffer,offset,length,position,canOwn)=>{offset>>>=0;if(length<0||position<0){throw new FS.ErrnoError(28)}if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if((stream.flags&2097155)===0){throw new FS.ErrnoError(8)}if(FS.isDir(stream.node.mode)){throw new FS.ErrnoError(31)}if(!stream.stream_ops.write){throw new FS.ErrnoError(28)}if(stream.seekable&&stream.flags&1024){FS.llseek(stream,0,2)}var seeking=typeof position!="undefined";if(!seeking){position=stream.position}else if(!stream.seekable){throw new FS.ErrnoError(70)}var bytesWritten=stream.stream_ops.write(stream,buffer,offset,length,position,canOwn);if(!seeking)stream.position+=bytesWritten;return bytesWritten},allocate:(stream,offset,length)=>{if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if(offset<0||length<=0){throw new FS.ErrnoError(28)}if((stream.flags&2097155)===0){throw new FS.ErrnoError(8)}if(!FS.isFile(stream.node.mode)&&!FS.isDir(stream.node.mode)){throw new FS.ErrnoError(43)}if(!stream.stream_ops.allocate){throw new FS.ErrnoError(138)}stream.stream_ops.allocate(stream,offset,length)},mmap:(stream,length,position,prot,flags)=>{if((prot&2)!==0&&(flags&2)===0&&(stream.flags&2097155)!==2){throw new FS.ErrnoError(2)}if((stream.flags&2097155)===1){throw new FS.ErrnoError(2)}if(!stream.stream_ops.mmap){throw new FS.ErrnoError(43)}return stream.stream_ops.mmap(stream,length,position,prot,flags)},msync:(stream,buffer,offset,length,mmapFlags)=>{offset>>>=0;if(!stream||!stream.stream_ops.msync){return 0}return stream.stream_ops.msync(stream,buffer,offset,length,mmapFlags)},munmap:stream=>0,ioctl:(stream,cmd,arg)=>{if(!stream.stream_ops.ioctl){throw new FS.ErrnoError(59)}return stream.stream_ops.ioctl(stream,cmd,arg)},readFile:(path,opts={})=>{opts.flags=opts.flags||0;opts.encoding=opts.encoding||"binary";if(opts.encoding!=="utf8"&&opts.encoding!=="binary"){throw new Error('Invalid encoding type "'+opts.encoding+'"')}var ret;var stream=FS.open(path,opts.flags);var stat=FS.stat(path);var length=stat.size;var buf=new Uint8Array(length);FS.read(stream,buf,0,length,0);if(opts.encoding==="utf8"){ret=UTF8ArrayToString(buf,0)}else if(opts.encoding==="binary"){ret=buf}FS.close(stream);return ret},writeFile:(path,data,opts={})=>{opts.flags=opts.flags||577;var stream=FS.open(path,opts.flags,opts.mode);if(typeof data=="string"){var buf=new Uint8Array(lengthBytesUTF8(data)+1);var actualNumBytes=stringToUTF8Array(data,buf,0,buf.length);FS.write(stream,buf,0,actualNumBytes,undefined,opts.canOwn)}else if(ArrayBuffer.isView(data)){FS.write(stream,data,0,data.byteLength,undefined,opts.canOwn)}else{throw new Error("Unsupported data type")}FS.close(stream)},cwd:()=>FS.currentPath,chdir:path=>{var lookup=FS.lookupPath(path,{follow:true});if(lookup.node===null){throw new FS.ErrnoError(44)}if(!FS.isDir(lookup.node.mode)){throw new FS.ErrnoError(54)}var errCode=FS.nodePermissions(lookup.node,"x");if(errCode){throw new FS.ErrnoError(errCode)}FS.currentPath=lookup.path},createDefaultDirectories:()=>{FS.mkdir("/tmp");FS.mkdir("/home");FS.mkdir("/home/web_user")},createDefaultDevices:()=>{FS.mkdir("/dev");FS.registerDevice(FS.makedev(1,3),{read:()=>0,write:(stream,buffer,offset,length,pos)=>length});FS.mkdev("/dev/null",FS.makedev(1,3));TTY.register(FS.makedev(5,0),TTY.default_tty_ops);TTY.register(FS.makedev(6,0),TTY.default_tty1_ops);FS.mkdev("/dev/tty",FS.makedev(5,0));FS.mkdev("/dev/tty1",FS.makedev(6,0));var random_device=getRandomDevice();FS.createDevice("/dev","random",random_device);FS.createDevice("/dev","urandom",random_device);FS.mkdir("/dev/shm");FS.mkdir("/dev/shm/tmp")},createSpecialDirectories:()=>{FS.mkdir("/proc");var proc_self=FS.mkdir("/proc/self");FS.mkdir("/proc/self/fd");FS.mount({mount:()=>{var node=FS.createNode(proc_self,"fd",16384|511,73);node.node_ops={lookup:(parent,name)=>{var fd=+name;var stream=FS.getStream(fd);if(!stream)throw new FS.ErrnoError(8);var ret={parent:null,mount:{mountpoint:"fake"},node_ops:{readlink:()=>stream.path}};ret.parent=ret;return ret}};return node}},{},"/proc/self/fd")},createStandardStreams:()=>{if(Module["stdin"]){FS.createDevice("/dev","stdin",Module["stdin"])}else{FS.symlink("/dev/tty","/dev/stdin")}if(Module["stdout"]){FS.createDevice("/dev","stdout",null,Module["stdout"])}else{FS.symlink("/dev/tty","/dev/stdout")}if(Module["stderr"]){FS.createDevice("/dev","stderr",null,Module["stderr"])}else{FS.symlink("/dev/tty1","/dev/stderr")}var stdin=FS.open("/dev/stdin",0);var stdout=FS.open("/dev/stdout",1);var stderr=FS.open("/dev/stderr",1)},ensureErrnoError:()=>{if(FS.ErrnoError)return;FS.ErrnoError=function ErrnoError(errno,node){this.node=node;this.setErrno=function(errno){this.errno=errno};this.setErrno(errno);this.message="FS error"};FS.ErrnoError.prototype=new Error;FS.ErrnoError.prototype.constructor=FS.ErrnoError;[44].forEach(code=>{FS.genericErrors[code]=new FS.ErrnoError(code);FS.genericErrors[code].stack="<generic error, no stack>"})},staticInit:()=>{FS.ensureErrnoError();FS.nameTable=new Array(4096);FS.mount(MEMFS,{},"/");FS.createDefaultDirectories();FS.createDefaultDevices();FS.createSpecialDirectories();FS.filesystems={"MEMFS":MEMFS}},init:(input,output,error)=>{FS.init.initialized=true;FS.ensureErrnoError();Module["stdin"]=input||Module["stdin"];Module["stdout"]=output||Module["stdout"];Module["stderr"]=error||Module["stderr"];FS.createStandardStreams()},quit:()=>{FS.init.initialized=false;for(var i=0;i<FS.streams.length;i++){var stream=FS.streams[i];if(!stream){continue}FS.close(stream)}},getMode:(canRead,canWrite)=>{var mode=0;if(canRead)mode|=292|73;if(canWrite)mode|=146;return mode},findObject:(path,dontResolveLastLink)=>{var ret=FS.analyzePath(path,dontResolveLastLink);if(ret.exists){return ret.object}else{return null}},analyzePath:(path,dontResolveLastLink)=>{try{var lookup=FS.lookupPath(path,{follow:!dontResolveLastLink});path=lookup.path}catch(e){}var ret={isRoot:false,exists:false,error:0,name:null,path:null,object:null,parentExists:false,parentPath:null,parentObject:null};try{var lookup=FS.lookupPath(path,{parent:true});ret.parentExists=true;ret.parentPath=lookup.path;ret.parentObject=lookup.node;ret.name=PATH.basename(path);lookup=FS.lookupPath(path,{follow:!dontResolveLastLink});ret.exists=true;ret.path=lookup.path;ret.object=lookup.node;ret.name=lookup.node.name;ret.isRoot=lookup.path==="/"}catch(e){ret.error=e.errno}return ret},createPath:(parent,path,canRead,canWrite)=>{parent=typeof parent=="string"?parent:FS.getPath(parent);var parts=path.split("/").reverse();while(parts.length){var part=parts.pop();if(!part)continue;var current=PATH.join2(parent,part);try{FS.mkdir(current)}catch(e){}parent=current}return current},createFile:(parent,name,properties,canRead,canWrite)=>{var path=PATH.join2(typeof parent=="string"?parent:FS.getPath(parent),name);var mode=FS.getMode(canRead,canWrite);return FS.create(path,mode)},createDataFile:(parent,name,data,canRead,canWrite,canOwn)=>{var path=name;if(parent){parent=typeof parent=="string"?parent:FS.getPath(parent);path=name?PATH.join2(parent,name):parent}var mode=FS.getMode(canRead,canWrite);var node=FS.create(path,mode);if(data){if(typeof data=="string"){var arr=new Array(data.length);for(var i=0,len=data.length;i<len;++i)arr[i]=data.charCodeAt(i);data=arr}FS.chmod(node,mode|146);var stream=FS.open(node,577);FS.write(stream,data,0,data.length,0,canOwn);FS.close(stream);FS.chmod(node,mode)}return node},createDevice:(parent,name,input,output)=>{var path=PATH.join2(typeof parent=="string"?parent:FS.getPath(parent),name);var mode=FS.getMode(!!input,!!output);if(!FS.createDevice.major)FS.createDevice.major=64;var dev=FS.makedev(FS.createDevice.major++,0);FS.registerDevice(dev,{open:stream=>{stream.seekable=false},close:stream=>{if(output&&output.buffer&&output.buffer.length){output(10)}},read:(stream,buffer,offset,length,pos)=>{var bytesRead=0;for(var i=0;i<length;i++){var result;try{result=input()}catch(e){throw new FS.ErrnoError(29)}if(result===undefined&&bytesRead===0){throw new FS.ErrnoError(6)}if(result===null||result===undefined)break;bytesRead++;buffer[offset+i]=result}if(bytesRead){stream.node.timestamp=Date.now()}return bytesRead},write:(stream,buffer,offset,length,pos)=>{for(var i=0;i<length;i++){try{output(buffer[offset+i])}catch(e){throw new FS.ErrnoError(29)}}if(length){stream.node.timestamp=Date.now()}return i}});return FS.mkdev(path,mode,dev)},forceLoadFile:obj=>{if(obj.isDevice||obj.isFolder||obj.link||obj.contents)return true;if(typeof XMLHttpRequest!="undefined"){throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.")}else if(read_){try{obj.contents=intArrayFromString(read_(obj.url),true);obj.usedBytes=obj.contents.length}catch(e){throw new FS.ErrnoError(29)}}else{throw new Error("Cannot load without read() or XMLHttpRequest.")}},createLazyFile:(parent,name,url,canRead,canWrite)=>{function LazyUint8Array(){this.lengthKnown=false;this.chunks=[]}LazyUint8Array.prototype.get=function LazyUint8Array_get(idx){if(idx>this.length-1||idx<0){return undefined}var chunkOffset=idx%this.chunkSize;var chunkNum=idx/this.chunkSize|0;return this.getter(chunkNum)[chunkOffset]};LazyUint8Array.prototype.setDataGetter=function LazyUint8Array_setDataGetter(getter){this.getter=getter};LazyUint8Array.prototype.cacheLength=function LazyUint8Array_cacheLength(){var xhr=new XMLHttpRequest;xhr.open("HEAD",url,false);xhr.send(null);if(!(xhr.status>=200&&xhr.status<300||xhr.status===304))throw new Error("Couldn't load "+url+". Status: "+xhr.status);var datalength=Number(xhr.getResponseHeader("Content-length"));var header;var hasByteServing=(header=xhr.getResponseHeader("Accept-Ranges"))&&header==="bytes";var usesGzip=(header=xhr.getResponseHeader("Content-Encoding"))&&header==="gzip";var chunkSize=1024*1024;if(!hasByteServing)chunkSize=datalength;var doXHR=(from,to)=>{if(from>to)throw new Error("invalid range ("+from+", "+to+") or no bytes requested!");if(to>datalength-1)throw new Error("only "+datalength+" bytes available! programmer error!");var xhr=new XMLHttpRequest;xhr.open("GET",url,false);if(datalength!==chunkSize)xhr.setRequestHeader("Range","bytes="+from+"-"+to);xhr.responseType="arraybuffer";if(xhr.overrideMimeType){xhr.overrideMimeType("text/plain; charset=x-user-defined")}xhr.send(null);if(!(xhr.status>=200&&xhr.status<300||xhr.status===304))throw new Error("Couldn't load "+url+". Status: "+xhr.status);if(xhr.response!==undefined){return new Uint8Array(xhr.response||[])}else{return intArrayFromString(xhr.responseText||"",true)}};var lazyArray=this;lazyArray.setDataGetter(chunkNum=>{var start=chunkNum*chunkSize;var end=(chunkNum+1)*chunkSize-1;end=Math.min(end,datalength-1);if(typeof lazyArray.chunks[chunkNum]=="undefined"){lazyArray.chunks[chunkNum]=doXHR(start,end)}if(typeof lazyArray.chunks[chunkNum]=="undefined")throw new Error("doXHR failed!");return lazyArray.chunks[chunkNum]});if(usesGzip||!datalength){chunkSize=datalength=1;datalength=this.getter(0).length;chunkSize=datalength;out("LazyFiles on gzip forces download of the whole file when length is accessed")}this._length=datalength;this._chunkSize=chunkSize;this.lengthKnown=true};if(typeof XMLHttpRequest!="undefined"){if(!ENVIRONMENT_IS_WORKER)throw"Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";var lazyArray=new LazyUint8Array;Object.defineProperties(lazyArray,{length:{get:function(){if(!this.lengthKnown){this.cacheLength()}return this._length}},chunkSize:{get:function(){if(!this.lengthKnown){this.cacheLength()}return this._chunkSize}}});var properties={isDevice:false,contents:lazyArray}}else{var properties={isDevice:false,url:url}}var node=FS.createFile(parent,name,properties,canRead,canWrite);if(properties.contents){node.contents=properties.contents}else if(properties.url){node.contents=null;node.url=properties.url}Object.defineProperties(node,{usedBytes:{get:function(){return this.contents.length}}});var stream_ops={};var keys=Object.keys(node.stream_ops);keys.forEach(key=>{var fn=node.stream_ops[key];stream_ops[key]=function forceLoadLazyFile(){FS.forceLoadFile(node);return fn.apply(null,arguments)}});function writeChunks(stream,buffer,offset,length,position){var contents=stream.node.contents;if(position>=contents.length)return 0;var size=Math.min(contents.length-position,length);if(contents.slice){for(var i=0;i<size;i++){buffer[offset+i]=contents[position+i]}}else{for(var i=0;i<size;i++){buffer[offset+i]=contents.get(position+i)}}return size}stream_ops.read=(stream,buffer,offset,length,position)=>{FS.forceLoadFile(node);return writeChunks(stream,buffer,offset,length,position)};stream_ops.mmap=(stream,length,position,prot,flags)=>{FS.forceLoadFile(node);var ptr=mmapAlloc(length);if(!ptr){throw new FS.ErrnoError(48)}writeChunks(stream,HEAP8,ptr,length,position);return{ptr:ptr,allocated:true}};node.stream_ops=stream_ops;return node},createPreloadedFile:(parent,name,url,canRead,canWrite,onload,onerror,dontCreateFile,canOwn,preFinish)=>{var fullname=name?PATH_FS.resolve(PATH.join2(parent,name)):parent;var dep=getUniqueRunDependency("cp "+fullname);function processData(byteArray){function finish(byteArray){if(preFinish)preFinish();if(!dontCreateFile){FS.createDataFile(parent,name,byteArray,canRead,canWrite,canOwn)}if(onload)onload();removeRunDependency(dep)}if(Browser.handledByPreloadPlugin(byteArray,fullname,finish,()=>{if(onerror)onerror();removeRunDependency(dep)})){return}finish(byteArray)}addRunDependency(dep);if(typeof url=="string"){asyncLoad(url,byteArray=>processData(byteArray),onerror)}else{processData(url)}},indexedDB:()=>{return window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB},DB_NAME:()=>{return"EM_FS_"+window.location.pathname},DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:(paths,onload,onerror)=>{onload=onload||(()=>{});onerror=onerror||(()=>{});var indexedDB=FS.indexedDB();try{var openRequest=indexedDB.open(FS.DB_NAME(),FS.DB_VERSION)}catch(e){return onerror(e)}openRequest.onupgradeneeded=()=>{out("creating db");var db=openRequest.result;db.createObjectStore(FS.DB_STORE_NAME)};openRequest.onsuccess=()=>{var db=openRequest.result;var transaction=db.transaction([FS.DB_STORE_NAME],"readwrite");var files=transaction.objectStore(FS.DB_STORE_NAME);var ok=0,fail=0,total=paths.length;function finish(){if(fail==0)onload();else onerror()}paths.forEach(path=>{var putRequest=files.put(FS.analyzePath(path).object.contents,path);putRequest.onsuccess=()=>{ok++;if(ok+fail==total)finish()};putRequest.onerror=()=>{fail++;if(ok+fail==total)finish()}});transaction.onerror=onerror};openRequest.onerror=onerror},loadFilesFromDB:(paths,onload,onerror)=>{onload=onload||(()=>{});onerror=onerror||(()=>{});var indexedDB=FS.indexedDB();try{var openRequest=indexedDB.open(FS.DB_NAME(),FS.DB_VERSION)}catch(e){return onerror(e)}openRequest.onupgradeneeded=onerror;openRequest.onsuccess=()=>{var db=openRequest.result;try{var transaction=db.transaction([FS.DB_STORE_NAME],"readonly")}catch(e){onerror(e);return}var files=transaction.objectStore(FS.DB_STORE_NAME);var ok=0,fail=0,total=paths.length;function finish(){if(fail==0)onload();else onerror()}paths.forEach(path=>{var getRequest=files.get(path);getRequest.onsuccess=()=>{if(FS.analyzePath(path).exists){FS.unlink(path)}FS.createDataFile(PATH.dirname(path),PATH.basename(path),getRequest.result,true,true,true);ok++;if(ok+fail==total)finish()};getRequest.onerror=()=>{fail++;if(ok+fail==total)finish()}});transaction.onerror=onerror};openRequest.onerror=onerror}};var SYSCALLS={DEFAULT_POLLMASK:5,calculateAt:function(dirfd,path,allowEmpty){if(PATH.isAbs(path)){return path}var dir;if(dirfd===-100){dir=FS.cwd()}else{var dirstream=FS.getStream(dirfd);if(!dirstream)throw new FS.ErrnoError(8);dir=dirstream.path}if(path.length==0){if(!allowEmpty){throw new FS.ErrnoError(44)}return dir}return PATH.join2(dir,path)},doStat:function(func,path,buf){try{var stat=func(path)}catch(e){if(e&&e.node&&PATH.normalize(path)!==PATH.normalize(FS.getPath(e.node))){return-54}throw e}HEAP32[buf>>>2]=stat.dev;HEAP32[buf+4>>>2]=0;HEAP32[buf+8>>>2]=stat.ino;HEAP32[buf+12>>>2]=stat.mode;HEAP32[buf+16>>>2]=stat.nlink;HEAP32[buf+20>>>2]=stat.uid;HEAP32[buf+24>>>2]=stat.gid;HEAP32[buf+28>>>2]=stat.rdev;HEAP32[buf+32>>>2]=0;tempI64=[stat.size>>>0,(tempDouble=stat.size,+Math.abs(tempDouble)>=1?tempDouble>0?(Math.min(+Math.floor(tempDouble/4294967296),4294967295)|0)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[buf+40>>>2]=tempI64[0],HEAP32[buf+44>>>2]=tempI64[1];HEAP32[buf+48>>>2]=4096;HEAP32[buf+52>>>2]=stat.blocks;HEAP32[buf+56>>>2]=stat.atime.getTime()/1e3|0;HEAP32[buf+60>>>2]=0;HEAP32[buf+64>>>2]=stat.mtime.getTime()/1e3|0;HEAP32[buf+68>>>2]=0;HEAP32[buf+72>>>2]=stat.ctime.getTime()/1e3|0;HEAP32[buf+76>>>2]=0;tempI64=[stat.ino>>>0,(tempDouble=stat.ino,+Math.abs(tempDouble)>=1?tempDouble>0?(Math.min(+Math.floor(tempDouble/4294967296),4294967295)|0)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[buf+80>>>2]=tempI64[0],HEAP32[buf+84>>>2]=tempI64[1];return 0},doMsync:function(addr,stream,len,flags,offset){var buffer=HEAPU8.slice(addr,addr+len);FS.msync(stream,buffer,offset,len,flags)},varargs:undefined,get:function(){SYSCALLS.varargs+=4;var ret=HEAP32[SYSCALLS.varargs-4>>>2];return ret},getStr:function(ptr){var ret=UTF8ToString(ptr);return ret},getStreamFromFD:function(fd){var stream=FS.getStream(fd);if(!stream)throw new FS.ErrnoError(8);return stream}};function ___syscall_chdir(path){try{path=SYSCALLS.getStr(path);FS.chdir(path);return 0}catch(e){if(typeof FS=="undefined"||!(e instanceof FS.ErrnoError))throw e;return-e.errno}}function ___syscall_chmod(path,mode){try{path=SYSCALLS.getStr(path);FS.chmod(path,mode);return 0}catch(e){if(typeof FS=="undefined"||!(e instanceof FS.ErrnoError))throw e;return-e.errno}}function ___syscall_faccessat(dirfd,path,amode,flags){try{path=SYSCALLS.getStr(path);path=SYSCALLS.calculateAt(dirfd,path);if(amode&~7){return-28}var lookup=FS.lookupPath(path,{follow:true});var node=lookup.node;if(!node){return-44}var perms="";if(amode&4)perms+="r";if(amode&2)perms+="w";if(amode&1)perms+="x";if(perms&&FS.nodePermissions(node,perms)){return-2}return 0}catch(e){if(typeof FS=="undefined"||!(e instanceof FS.ErrnoError))throw e;return-e.errno}}function setErrNo(value){HEAP32[___errno_location()>>>2]=value;return value}function ___syscall_fcntl64(fd,cmd,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(fd);switch(cmd){case 0:{var arg=SYSCALLS.get();if(arg<0){return-28}var newStream;newStream=FS.createStream(stream,arg);return newStream.fd}case 1:case 2:return 0;case 3:return stream.flags;case 4:{var arg=SYSCALLS.get();stream.flags|=arg;return 0}case 5:{var arg=SYSCALLS.get();var offset=0;HEAP16[arg+offset>>>1]=2;return 0}case 6:case 7:return 0;case 16:case 8:return-28;case 9:setErrNo(28);return-1;default:{return-28}}}catch(e){if(typeof FS=="undefined"||!(e instanceof FS.ErrnoError))throw e;return-e.errno}}function ___syscall_fstat64(fd,buf){try{var stream=SYSCALLS.getStreamFromFD(fd);return SYSCALLS.doStat(FS.stat,stream.path,buf)}catch(e){if(typeof FS=="undefined"||!(e instanceof FS.ErrnoError))throw e;return-e.errno}}function ___syscall_getcwd(buf,size){try{if(size===0)return-28;var cwd=FS.cwd();var cwdLengthInBytes=lengthBytesUTF8(cwd)+1;if(size<cwdLengthInBytes)return-68;stringToUTF8(cwd,buf,size);return cwdLengthInBytes}catch(e){if(typeof FS=="undefined"||!(e instanceof FS.ErrnoError))throw e;return-e.errno}}function ___syscall_getdents64(fd,dirp,count){try{var stream=SYSCALLS.getStreamFromFD(fd);if(!stream.getdents){stream.getdents=FS.readdir(stream.path)}var struct_size=280;var pos=0;var off=FS.llseek(stream,0,1);var idx=Math.floor(off/struct_size);while(idx<stream.getdents.length&&pos+struct_size<=count){var id;var type;var name=stream.getdents[idx];if(name==="."){id=stream.node.id;type=4}else if(name===".."){var lookup=FS.lookupPath(stream.path,{parent:true});id=lookup.node.id;type=4}else{var child=FS.lookupNode(stream.node,name);id=child.id;type=FS.isChrdev(child.mode)?2:FS.isDir(child.mode)?4:FS.isLink(child.mode)?10:8}tempI64=[id>>>0,(tempDouble=id,+Math.abs(tempDouble)>=1?tempDouble>0?(Math.min(+Math.floor(tempDouble/4294967296),4294967295)|0)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[dirp+pos>>>2]=tempI64[0],HEAP32[dirp+pos+4>>>2]=tempI64[1];tempI64=[(idx+1)*struct_size>>>0,(tempDouble=(idx+1)*struct_size,+Math.abs(tempDouble)>=1?tempDouble>0?(Math.min(+Math.floor(tempDouble/4294967296),4294967295)|0)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[dirp+pos+8>>>2]=tempI64[0],HEAP32[dirp+pos+12>>>2]=tempI64[1];HEAP16[dirp+pos+16>>>1]=280;HEAP8[dirp+pos+18>>>0]=type;stringToUTF8(name,dirp+pos+19,256);pos+=struct_size;idx+=1}FS.llseek(stream,idx*struct_size,0);return pos}catch(e){if(typeof FS=="undefined"||!(e instanceof FS.ErrnoError))throw e;return-e.errno}}function ___syscall_ioctl(fd,op,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(fd);switch(op){case 21509:case 21505:{if(!stream.tty)return-59;return 0}case 21510:case 21511:case 21512:case 21506:case 21507:case 21508:{if(!stream.tty)return-59;return 0}case 21519:{if(!stream.tty)return-59;var argp=SYSCALLS.get();HEAP32[argp>>>2]=0;return 0}case 21520:{if(!stream.tty)return-59;return-28}case 21531:{var argp=SYSCALLS.get();return FS.ioctl(stream,op,argp)}case 21523:{if(!stream.tty)return-59;return 0}case 21524:{if(!stream.tty)return-59;return 0}default:abort("bad ioctl syscall "+op)}}catch(e){if(typeof FS=="undefined"||!(e instanceof FS.ErrnoError))throw e;return-e.errno}}function ___syscall_lstat64(path,buf){try{path=SYSCALLS.getStr(path);return SYSCALLS.doStat(FS.lstat,path,buf)}catch(e){if(typeof FS=="undefined"||!(e instanceof FS.ErrnoError))throw e;return-e.errno}}function ___syscall_mkdirat(dirfd,path,mode){try{path=SYSCALLS.getStr(path);path=SYSCALLS.calculateAt(dirfd,path);path=PATH.normalize(path);if(path[path.length-1]==="/")path=path.substr(0,path.length-1);FS.mkdir(path,mode,0);return 0}catch(e){if(typeof FS=="undefined"||!(e instanceof FS.ErrnoError))throw e;return-e.errno}}function ___syscall_newfstatat(dirfd,path,buf,flags){try{path=SYSCALLS.getStr(path);var nofollow=flags&256;var allowEmpty=flags&4096;flags=flags&~4352;path=SYSCALLS.calculateAt(dirfd,path,allowEmpty);return SYSCALLS.doStat(nofollow?FS.lstat:FS.stat,path,buf)}catch(e){if(typeof FS=="undefined"||!(e instanceof FS.ErrnoError))throw e;return-e.errno}}function ___syscall_openat(dirfd,path,flags,varargs){SYSCALLS.varargs=varargs;try{path=SYSCALLS.getStr(path);path=SYSCALLS.calculateAt(dirfd,path);var mode=varargs?SYSCALLS.get():0;return FS.open(path,flags,mode).fd}catch(e){if(typeof FS=="undefined"||!(e instanceof FS.ErrnoError))throw e;return-e.errno}}function ___syscall_rmdir(path){try{path=SYSCALLS.getStr(path);FS.rmdir(path);return 0}catch(e){if(typeof FS=="undefined"||!(e instanceof FS.ErrnoError))throw e;return-e.errno}}function ___syscall_stat64(path,buf){try{path=SYSCALLS.getStr(path);return SYSCALLS.doStat(FS.stat,path,buf)}catch(e){if(typeof FS=="undefined"||!(e instanceof FS.ErrnoError))throw e;return-e.errno}}function ___syscall_statfs64(path,size,buf){try{path=SYSCALLS.getStr(path);HEAP32[buf+4>>>2]=4096;HEAP32[buf+40>>>2]=4096;HEAP32[buf+8>>>2]=1e6;HEAP32[buf+12>>>2]=5e5;HEAP32[buf+16>>>2]=5e5;HEAP32[buf+20>>>2]=FS.nextInode;HEAP32[buf+24>>>2]=1e6;HEAP32[buf+28>>>2]=42;HEAP32[buf+44>>>2]=2;HEAP32[buf+36>>>2]=255;return 0}catch(e){if(typeof FS=="undefined"||!(e instanceof FS.ErrnoError))throw e;return-e.errno}}function ___syscall_unlinkat(dirfd,path,flags){try{path=SYSCALLS.getStr(path);path=SYSCALLS.calculateAt(dirfd,path);if(flags===0){FS.unlink(path)}else if(flags===512){FS.rmdir(path)}else{abort("Invalid flags passed to unlinkat")}return 0}catch(e){if(typeof FS=="undefined"||!(e instanceof FS.ErrnoError))throw e;return-e.errno}}function __dlinit(main_dso_handle){}var dlopenMissingError="To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking";function __dlopen_js(filename,flag){abort(dlopenMissingError)}function __dlsym_js(handle,symbol){abort(dlopenMissingError)}function __embind_register_bigint(primitiveType,name,size,minRange,maxRange){}function getShiftFromSize(size){switch(size){case 1:return 0;case 2:return 1;case 4:return 2;case 8:return 3;default:throw new TypeError("Unknown type size: "+size)}}function embind_init_charCodes(){var codes=new Array(256);for(var i=0;i<256;++i){codes[i]=String.fromCharCode(i)}embind_charCodes=codes}var embind_charCodes=undefined;function readLatin1String(ptr){var ret="";var c=ptr;while(HEAPU8[c>>>0]){ret+=embind_charCodes[HEAPU8[c++>>>0]]}return ret}var awaitingDependencies={};var registeredTypes={};var typeDependencies={};var char_0=48;var char_9=57;function makeLegalFunctionName(name){if(undefined===name){return"_unknown"}name=name.replace(/[^a-zA-Z0-9_]/g,"$");var f=name.charCodeAt(0);if(f>=char_0&&f<=char_9){return"_"+name}return name}function createNamedFunction(name,body){name=makeLegalFunctionName(name);return new Function("body","return function "+name+"() {\n"+'    "use strict";'+"    return body.apply(this, arguments);\n"+"};\n")(body)}function extendError(baseErrorType,errorName){var errorClass=createNamedFunction(errorName,function(message){this.name=errorName;this.message=message;var stack=new Error(message).stack;if(stack!==undefined){this.stack=this.toString()+"\n"+stack.replace(/^Error(:[^\n]*)?\n/,"")}});errorClass.prototype=Object.create(baseErrorType.prototype);errorClass.prototype.constructor=errorClass;errorClass.prototype.toString=function(){if(this.message===undefined){return this.name}else{return this.name+": "+this.message}};return errorClass}var BindingError=undefined;function throwBindingError(message){throw new BindingError(message)}var InternalError=undefined;function throwInternalError(message){throw new InternalError(message)}function whenDependentTypesAreResolved(myTypes,dependentTypes,getTypeConverters){myTypes.forEach(function(type){typeDependencies[type]=dependentTypes});function onComplete(typeConverters){var myTypeConverters=getTypeConverters(typeConverters);if(myTypeConverters.length!==myTypes.length){throwInternalError("Mismatched type converter count")}for(var i=0;i<myTypes.length;++i){registerType(myTypes[i],myTypeConverters[i])}}var typeConverters=new Array(dependentTypes.length);var unregisteredTypes=[];var registered=0;dependentTypes.forEach((dt,i)=>{if(registeredTypes.hasOwnProperty(dt)){typeConverters[i]=registeredTypes[dt]}else{unregisteredTypes.push(dt);if(!awaitingDependencies.hasOwnProperty(dt)){awaitingDependencies[dt]=[]}awaitingDependencies[dt].push(()=>{typeConverters[i]=registeredTypes[dt];++registered;if(registered===unregisteredTypes.length){onComplete(typeConverters)}})}});if(0===unregisteredTypes.length){onComplete(typeConverters)}}function registerType(rawType,registeredInstance,options={}){if(!("argPackAdvance"in registeredInstance)){throw new TypeError("registerType registeredInstance requires argPackAdvance")}var name=registeredInstance.name;if(!rawType){throwBindingError('type "'+name+'" must have a positive integer typeid pointer')}if(registeredTypes.hasOwnProperty(rawType)){if(options.ignoreDuplicateRegistrations){return}else{throwBindingError("Cannot register type '"+name+"' twice")}}registeredTypes[rawType]=registeredInstance;delete typeDependencies[rawType];if(awaitingDependencies.hasOwnProperty(rawType)){var callbacks=awaitingDependencies[rawType];delete awaitingDependencies[rawType];callbacks.forEach(cb=>cb())}}function __embind_register_bool(rawType,name,size,trueValue,falseValue){var shift=getShiftFromSize(size);name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":function(wt){return!!wt},"toWireType":function(destructors,o){return o?trueValue:falseValue},"argPackAdvance":8,"readValueFromPointer":function(pointer){var heap;if(size===1){heap=HEAP8}else if(size===2){heap=HEAP16}else if(size===4){heap=HEAP32}else{throw new TypeError("Unknown boolean type size: "+name)}return this["fromWireType"](heap[pointer>>>shift])},destructorFunction:null})}function ClassHandle_isAliasOf(other){if(!(this instanceof ClassHandle)){return false}if(!(other instanceof ClassHandle)){return false}var leftClass=this.$$.ptrType.registeredClass;var left=this.$$.ptr;var rightClass=other.$$.ptrType.registeredClass;var right=other.$$.ptr;while(leftClass.baseClass){left=leftClass.upcast(left);leftClass=leftClass.baseClass}while(rightClass.baseClass){right=rightClass.upcast(right);rightClass=rightClass.baseClass}return leftClass===rightClass&&left===right}function shallowCopyInternalPointer(o){return{count:o.count,deleteScheduled:o.deleteScheduled,preservePointerOnDelete:o.preservePointerOnDelete,ptr:o.ptr,ptrType:o.ptrType,smartPtr:o.smartPtr,smartPtrType:o.smartPtrType}}function throwInstanceAlreadyDeleted(obj){function getInstanceTypeName(handle){return handle.$$.ptrType.registeredClass.name}throwBindingError(getInstanceTypeName(obj)+" instance already deleted")}var finalizationRegistry=false;function detachFinalizer(handle){}function runDestructor($$){if($$.smartPtr){$$.smartPtrType.rawDestructor($$.smartPtr)}else{$$.ptrType.registeredClass.rawDestructor($$.ptr)}}function releaseClassHandle($$){$$.count.value-=1;var toDelete=0===$$.count.value;if(toDelete){runDestructor($$)}}function downcastPointer(ptr,ptrClass,desiredClass){if(ptrClass===desiredClass){return ptr}if(undefined===desiredClass.baseClass){return null}var rv=downcastPointer(ptr,ptrClass,desiredClass.baseClass);if(rv===null){return null}return desiredClass.downcast(rv)}var registeredPointers={};function getInheritedInstanceCount(){return Object.keys(registeredInstances).length}function getLiveInheritedInstances(){var rv=[];for(var k in registeredInstances){if(registeredInstances.hasOwnProperty(k)){rv.push(registeredInstances[k])}}return rv}var deletionQueue=[];function flushPendingDeletes(){while(deletionQueue.length){var obj=deletionQueue.pop();obj.$$.deleteScheduled=false;obj["delete"]()}}var delayFunction=undefined;function setDelayFunction(fn){delayFunction=fn;if(deletionQueue.length&&delayFunction){delayFunction(flushPendingDeletes)}}function init_embind(){Module["getInheritedInstanceCount"]=getInheritedInstanceCount;Module["getLiveInheritedInstances"]=getLiveInheritedInstances;Module["flushPendingDeletes"]=flushPendingDeletes;Module["setDelayFunction"]=setDelayFunction}var registeredInstances={};function getBasestPointer(class_,ptr){if(ptr===undefined){throwBindingError("ptr should not be undefined")}while(class_.baseClass){ptr=class_.upcast(ptr);class_=class_.baseClass}return ptr}function getInheritedInstance(class_,ptr){ptr=getBasestPointer(class_,ptr);return registeredInstances[ptr]}function makeClassHandle(prototype,record){if(!record.ptrType||!record.ptr){throwInternalError("makeClassHandle requires ptr and ptrType")}var hasSmartPtrType=!!record.smartPtrType;var hasSmartPtr=!!record.smartPtr;if(hasSmartPtrType!==hasSmartPtr){throwInternalError("Both smartPtrType and smartPtr must be specified")}record.count={value:1};return attachFinalizer(Object.create(prototype,{$$:{value:record}}))}function RegisteredPointer_fromWireType(ptr){var rawPointer=this.getPointee(ptr);if(!rawPointer){this.destructor(ptr);return null}var registeredInstance=getInheritedInstance(this.registeredClass,rawPointer);if(undefined!==registeredInstance){if(0===registeredInstance.$$.count.value){registeredInstance.$$.ptr=rawPointer;registeredInstance.$$.smartPtr=ptr;return registeredInstance["clone"]()}else{var rv=registeredInstance["clone"]();this.destructor(ptr);return rv}}function makeDefaultHandle(){if(this.isSmartPointer){return makeClassHandle(this.registeredClass.instancePrototype,{ptrType:this.pointeeType,ptr:rawPointer,smartPtrType:this,smartPtr:ptr})}else{return makeClassHandle(this.registeredClass.instancePrototype,{ptrType:this,ptr:ptr})}}var actualType=this.registeredClass.getActualType(rawPointer);var registeredPointerRecord=registeredPointers[actualType];if(!registeredPointerRecord){return makeDefaultHandle.call(this)}var toType;if(this.isConst){toType=registeredPointerRecord.constPointerType}else{toType=registeredPointerRecord.pointerType}var dp=downcastPointer(rawPointer,this.registeredClass,toType.registeredClass);if(dp===null){return makeDefaultHandle.call(this)}if(this.isSmartPointer){return makeClassHandle(toType.registeredClass.instancePrototype,{ptrType:toType,ptr:dp,smartPtrType:this,smartPtr:ptr})}else{return makeClassHandle(toType.registeredClass.instancePrototype,{ptrType:toType,ptr:dp})}}function attachFinalizer(handle){if("undefined"===typeof FinalizationRegistry){attachFinalizer=handle=>handle;return handle}finalizationRegistry=new FinalizationRegistry(info=>{releaseClassHandle(info.$$)});attachFinalizer=handle=>{var $$=handle.$$;var hasSmartPtr=!!$$.smartPtr;if(hasSmartPtr){var info={$$:$$};finalizationRegistry.register(handle,info,handle)}return handle};detachFinalizer=handle=>finalizationRegistry.unregister(handle);return attachFinalizer(handle)}function ClassHandle_clone(){if(!this.$$.ptr){throwInstanceAlreadyDeleted(this)}if(this.$$.preservePointerOnDelete){this.$$.count.value+=1;return this}else{var clone=attachFinalizer(Object.create(Object.getPrototypeOf(this),{$$:{value:shallowCopyInternalPointer(this.$$)}}));clone.$$.count.value+=1;clone.$$.deleteScheduled=false;return clone}}function ClassHandle_delete(){if(!this.$$.ptr){throwInstanceAlreadyDeleted(this)}if(this.$$.deleteScheduled&&!this.$$.preservePointerOnDelete){throwBindingError("Object already scheduled for deletion")}detachFinalizer(this);releaseClassHandle(this.$$);if(!this.$$.preservePointerOnDelete){this.$$.smartPtr=undefined;this.$$.ptr=undefined}}function ClassHandle_isDeleted(){return!this.$$.ptr}function ClassHandle_deleteLater(){if(!this.$$.ptr){throwInstanceAlreadyDeleted(this)}if(this.$$.deleteScheduled&&!this.$$.preservePointerOnDelete){throwBindingError("Object already scheduled for deletion")}deletionQueue.push(this);if(deletionQueue.length===1&&delayFunction){delayFunction(flushPendingDeletes)}this.$$.deleteScheduled=true;return this}function init_ClassHandle(){ClassHandle.prototype["isAliasOf"]=ClassHandle_isAliasOf;ClassHandle.prototype["clone"]=ClassHandle_clone;ClassHandle.prototype["delete"]=ClassHandle_delete;ClassHandle.prototype["isDeleted"]=ClassHandle_isDeleted;ClassHandle.prototype["deleteLater"]=ClassHandle_deleteLater}function ClassHandle(){}function ensureOverloadTable(proto,methodName,humanName){if(undefined===proto[methodName].overloadTable){var prevFunc=proto[methodName];proto[methodName]=function(){if(!proto[methodName].overloadTable.hasOwnProperty(arguments.length)){throwBindingError("Function '"+humanName+"' called with an invalid number of arguments ("+arguments.length+") - expects one of ("+proto[methodName].overloadTable+")!")}return proto[methodName].overloadTable[arguments.length].apply(this,arguments)};proto[methodName].overloadTable=[];proto[methodName].overloadTable[prevFunc.argCount]=prevFunc}}function exposePublicSymbol(name,value,numArguments){if(Module.hasOwnProperty(name)){if(undefined===numArguments||undefined!==Module[name].overloadTable&&undefined!==Module[name].overloadTable[numArguments]){throwBindingError("Cannot register public name '"+name+"' twice")}ensureOverloadTable(Module,name,name);if(Module.hasOwnProperty(numArguments)){throwBindingError("Cannot register multiple overloads of a function with the same number of arguments ("+numArguments+")!")}Module[name].overloadTable[numArguments]=value}else{Module[name]=value;if(undefined!==numArguments){Module[name].numArguments=numArguments}}}function RegisteredClass(name,constructor,instancePrototype,rawDestructor,baseClass,getActualType,upcast,downcast){this.name=name;this.constructor=constructor;this.instancePrototype=instancePrototype;this.rawDestructor=rawDestructor;this.baseClass=baseClass;this.getActualType=getActualType;this.upcast=upcast;this.downcast=downcast;this.pureVirtualFunctions=[]}function upcastPointer(ptr,ptrClass,desiredClass){while(ptrClass!==desiredClass){if(!ptrClass.upcast){throwBindingError("Expected null or instance of "+desiredClass.name+", got an instance of "+ptrClass.name)}ptr=ptrClass.upcast(ptr);ptrClass=ptrClass.baseClass}return ptr}function constNoSmartPtrRawPointerToWireType(destructors,handle){if(handle===null){if(this.isReference){throwBindingError("null is not a valid "+this.name)}return 0}if(!handle.$$){throwBindingError('Cannot pass "'+_embind_repr(handle)+'" as a '+this.name)}if(!handle.$$.ptr){throwBindingError("Cannot pass deleted object as a pointer of type "+this.name)}var handleClass=handle.$$.ptrType.registeredClass;var ptr=upcastPointer(handle.$$.ptr,handleClass,this.registeredClass);return ptr}function genericPointerToWireType(destructors,handle){var ptr;if(handle===null){if(this.isReference){throwBindingError("null is not a valid "+this.name)}if(this.isSmartPointer){ptr=this.rawConstructor();if(destructors!==null){destructors.push(this.rawDestructor,ptr)}return ptr}else{return 0}}if(!handle.$$){throwBindingError('Cannot pass "'+_embind_repr(handle)+'" as a '+this.name)}if(!handle.$$.ptr){throwBindingError("Cannot pass deleted object as a pointer of type "+this.name)}if(!this.isConst&&handle.$$.ptrType.isConst){throwBindingError("Cannot convert argument of type "+(handle.$$.smartPtrType?handle.$$.smartPtrType.name:handle.$$.ptrType.name)+" to parameter type "+this.name)}var handleClass=handle.$$.ptrType.registeredClass;ptr=upcastPointer(handle.$$.ptr,handleClass,this.registeredClass);if(this.isSmartPointer){if(undefined===handle.$$.smartPtr){throwBindingError("Passing raw pointer to smart pointer is illegal")}switch(this.sharingPolicy){case 0:if(handle.$$.smartPtrType===this){ptr=handle.$$.smartPtr}else{throwBindingError("Cannot convert argument of type "+(handle.$$.smartPtrType?handle.$$.smartPtrType.name:handle.$$.ptrType.name)+" to parameter type "+this.name)}break;case 1:ptr=handle.$$.smartPtr;break;case 2:if(handle.$$.smartPtrType===this){ptr=handle.$$.smartPtr}else{var clonedHandle=handle["clone"]();ptr=this.rawShare(ptr,Emval.toHandle(function(){clonedHandle["delete"]()}));if(destructors!==null){destructors.push(this.rawDestructor,ptr)}}break;default:throwBindingError("Unsupporting sharing policy")}}return ptr}function nonConstNoSmartPtrRawPointerToWireType(destructors,handle){if(handle===null){if(this.isReference){throwBindingError("null is not a valid "+this.name)}return 0}if(!handle.$$){throwBindingError('Cannot pass "'+_embind_repr(handle)+'" as a '+this.name)}if(!handle.$$.ptr){throwBindingError("Cannot pass deleted object as a pointer of type "+this.name)}if(handle.$$.ptrType.isConst){throwBindingError("Cannot convert argument of type "+handle.$$.ptrType.name+" to parameter type "+this.name)}var handleClass=handle.$$.ptrType.registeredClass;var ptr=upcastPointer(handle.$$.ptr,handleClass,this.registeredClass);return ptr}function simpleReadValueFromPointer(pointer){return this["fromWireType"](HEAPU32[pointer>>>2])}function RegisteredPointer_getPointee(ptr){if(this.rawGetPointee){ptr=this.rawGetPointee(ptr)}return ptr}function RegisteredPointer_destructor(ptr){if(this.rawDestructor){this.rawDestructor(ptr)}}function RegisteredPointer_deleteObject(handle){if(handle!==null){handle["delete"]()}}function init_RegisteredPointer(){RegisteredPointer.prototype.getPointee=RegisteredPointer_getPointee;RegisteredPointer.prototype.destructor=RegisteredPointer_destructor;RegisteredPointer.prototype["argPackAdvance"]=8;RegisteredPointer.prototype["readValueFromPointer"]=simpleReadValueFromPointer;RegisteredPointer.prototype["deleteObject"]=RegisteredPointer_deleteObject;RegisteredPointer.prototype["fromWireType"]=RegisteredPointer_fromWireType}function RegisteredPointer(name,registeredClass,isReference,isConst,isSmartPointer,pointeeType,sharingPolicy,rawGetPointee,rawConstructor,rawShare,rawDestructor){this.name=name;this.registeredClass=registeredClass;this.isReference=isReference;this.isConst=isConst;this.isSmartPointer=isSmartPointer;this.pointeeType=pointeeType;this.sharingPolicy=sharingPolicy;this.rawGetPointee=rawGetPointee;this.rawConstructor=rawConstructor;this.rawShare=rawShare;this.rawDestructor=rawDestructor;if(!isSmartPointer&&registeredClass.baseClass===undefined){if(isConst){this["toWireType"]=constNoSmartPtrRawPointerToWireType;this.destructorFunction=null}else{this["toWireType"]=nonConstNoSmartPtrRawPointerToWireType;this.destructorFunction=null}}else{this["toWireType"]=genericPointerToWireType}}function replacePublicSymbol(name,value,numArguments){if(!Module.hasOwnProperty(name)){throwInternalError("Replacing nonexistant public symbol")}if(undefined!==Module[name].overloadTable&&undefined!==numArguments){Module[name].overloadTable[numArguments]=value}else{Module[name]=value;Module[name].argCount=numArguments}}function dynCallLegacy(sig,ptr,args){var f=Module["dynCall_"+sig];return args&&args.length?f.apply(null,[ptr].concat(args)):f.call(null,ptr)}function dynCall(sig,ptr,args){if(sig.includes("j")){return dynCallLegacy(sig,ptr,args)}return getWasmTableEntry(ptr).apply(null,args)}function getDynCaller(sig,ptr){var argCache=[];return function(){argCache.length=0;Object.assign(argCache,arguments);return dynCall(sig,ptr,argCache)}}function embind__requireFunction(signature,rawFunction){signature=readLatin1String(signature);function makeDynCaller(){if(signature.includes("j")){return getDynCaller(signature,rawFunction)}return getWasmTableEntry(rawFunction)}var fp=makeDynCaller();if(typeof fp!="function"){throwBindingError("unknown function pointer with signature "+signature+": "+rawFunction)}return fp}var UnboundTypeError=undefined;function getTypeName(type){var ptr=___getTypeName(type);var rv=readLatin1String(ptr);_free(ptr);return rv}function throwUnboundTypeError(message,types){var unboundTypes=[];var seen={};function visit(type){if(seen[type]){return}if(registeredTypes[type]){return}if(typeDependencies[type]){typeDependencies[type].forEach(visit);return}unboundTypes.push(type);seen[type]=true}types.forEach(visit);throw new UnboundTypeError(message+": "+unboundTypes.map(getTypeName).join([", "]))}function __embind_register_class(rawType,rawPointerType,rawConstPointerType,baseClassRawType,getActualTypeSignature,getActualType,upcastSignature,upcast,downcastSignature,downcast,name,destructorSignature,rawDestructor){name=readLatin1String(name);getActualType=embind__requireFunction(getActualTypeSignature,getActualType);if(upcast){upcast=embind__requireFunction(upcastSignature,upcast)}if(downcast){downcast=embind__requireFunction(downcastSignature,downcast)}rawDestructor=embind__requireFunction(destructorSignature,rawDestructor);var legalFunctionName=makeLegalFunctionName(name);exposePublicSymbol(legalFunctionName,function(){throwUnboundTypeError("Cannot construct "+name+" due to unbound types",[baseClassRawType])});whenDependentTypesAreResolved([rawType,rawPointerType,rawConstPointerType],baseClassRawType?[baseClassRawType]:[],function(base){base=base[0];var baseClass;var basePrototype;if(baseClassRawType){baseClass=base.registeredClass;basePrototype=baseClass.instancePrototype}else{basePrototype=ClassHandle.prototype}var constructor=createNamedFunction(legalFunctionName,function(){if(Object.getPrototypeOf(this)!==instancePrototype){throw new BindingError("Use 'new' to construct "+name)}if(undefined===registeredClass.constructor_body){throw new BindingError(name+" has no accessible constructor")}var body=registeredClass.constructor_body[arguments.length];if(undefined===body){throw new BindingError("Tried to invoke ctor of "+name+" with invalid number of parameters ("+arguments.length+") - expected ("+Object.keys(registeredClass.constructor_body).toString()+") parameters instead!")}return body.apply(this,arguments)});var instancePrototype=Object.create(basePrototype,{constructor:{value:constructor}});constructor.prototype=instancePrototype;var registeredClass=new RegisteredClass(name,constructor,instancePrototype,rawDestructor,baseClass,getActualType,upcast,downcast);var referenceConverter=new RegisteredPointer(name,registeredClass,true,false,false);var pointerConverter=new RegisteredPointer(name+"*",registeredClass,false,false,false);var constPointerConverter=new RegisteredPointer(name+" const*",registeredClass,false,true,false);registeredPointers[rawType]={pointerType:pointerConverter,constPointerType:constPointerConverter};replacePublicSymbol(legalFunctionName,constructor);return[referenceConverter,pointerConverter,constPointerConverter]})}function new_(constructor,argumentList){if(!(constructor instanceof Function)){throw new TypeError("new_ called with constructor type "+typeof constructor+" which is not a function")}var dummy=createNamedFunction(constructor.name||"unknownFunctionName",function(){});dummy.prototype=constructor.prototype;var obj=new dummy;var r=constructor.apply(obj,argumentList);return r instanceof Object?r:obj}function runDestructors(destructors){while(destructors.length){var ptr=destructors.pop();var del=destructors.pop();del(ptr)}}function craftInvokerFunction(humanName,argTypes,classType,cppInvokerFunc,cppTargetFunc){var argCount=argTypes.length;if(argCount<2){throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!")}var isClassMethodFunc=argTypes[1]!==null&&classType!==null;var needsDestructorStack=false;for(var i=1;i<argTypes.length;++i){if(argTypes[i]!==null&&argTypes[i].destructorFunction===undefined){needsDestructorStack=true;break}}var returns=argTypes[0].name!=="void";var argsList="";var argsListWired="";for(var i=0;i<argCount-2;++i){argsList+=(i!==0?", ":"")+"arg"+i;argsListWired+=(i!==0?", ":"")+"arg"+i+"Wired"}var invokerFnBody="return function "+makeLegalFunctionName(humanName)+"("+argsList+") {\n"+"if (arguments.length !== "+(argCount-2)+") {\n"+"throwBindingError('function "+humanName+" called with ' + arguments.length + ' arguments, expected "+(argCount-2)+" args!');\n"+"}\n";if(needsDestructorStack){invokerFnBody+="var destructors = [];\n"}var dtorStack=needsDestructorStack?"destructors":"null";var args1=["throwBindingError","invoker","fn","runDestructors","retType","classParam"];var args2=[throwBindingError,cppInvokerFunc,cppTargetFunc,runDestructors,argTypes[0],argTypes[1]];if(isClassMethodFunc){invokerFnBody+="var thisWired = classParam.toWireType("+dtorStack+", this);\n"}for(var i=0;i<argCount-2;++i){invokerFnBody+="var arg"+i+"Wired = argType"+i+".toWireType("+dtorStack+", arg"+i+"); // "+argTypes[i+2].name+"\n";args1.push("argType"+i);args2.push(argTypes[i+2])}if(isClassMethodFunc){argsListWired="thisWired"+(argsListWired.length>0?", ":"")+argsListWired}invokerFnBody+=(returns?"var rv = ":"")+"invoker(fn"+(argsListWired.length>0?", ":"")+argsListWired+");\n";if(needsDestructorStack){invokerFnBody+="runDestructors(destructors);\n"}else{for(var i=isClassMethodFunc?1:2;i<argTypes.length;++i){var paramName=i===1?"thisWired":"arg"+(i-2)+"Wired";if(argTypes[i].destructorFunction!==null){invokerFnBody+=paramName+"_dtor("+paramName+"); // "+argTypes[i].name+"\n";args1.push(paramName+"_dtor");args2.push(argTypes[i].destructorFunction)}}}if(returns){invokerFnBody+="var ret = retType.fromWireType(rv);\n"+"return ret;\n"}else{}invokerFnBody+="}\n";args1.push(invokerFnBody);var invokerFunction=new_(Function,args1).apply(null,args2);return invokerFunction}function heap32VectorToArray(count,firstElement){var array=[];for(var i=0;i<count;i++){array.push(HEAP32[(firstElement>>2)+i>>>0])}return array}function __embind_register_class_class_function(rawClassType,methodName,argCount,rawArgTypesAddr,invokerSignature,rawInvoker,fn){var rawArgTypes=heap32VectorToArray(argCount,rawArgTypesAddr);methodName=readLatin1String(methodName);rawInvoker=embind__requireFunction(invokerSignature,rawInvoker);whenDependentTypesAreResolved([],[rawClassType],function(classType){classType=classType[0];var humanName=classType.name+"."+methodName;function unboundTypesHandler(){throwUnboundTypeError("Cannot call "+humanName+" due to unbound types",rawArgTypes)}if(methodName.startsWith("@@")){methodName=Symbol[methodName.substring(2)]}var proto=classType.registeredClass.constructor;if(undefined===proto[methodName]){unboundTypesHandler.argCount=argCount-1;proto[methodName]=unboundTypesHandler}else{ensureOverloadTable(proto,methodName,humanName);proto[methodName].overloadTable[argCount-1]=unboundTypesHandler}whenDependentTypesAreResolved([],rawArgTypes,function(argTypes){var invokerArgsArray=[argTypes[0],null].concat(argTypes.slice(1));var func=craftInvokerFunction(humanName,invokerArgsArray,null,rawInvoker,fn);if(undefined===proto[methodName].overloadTable){func.argCount=argCount-1;proto[methodName]=func}else{proto[methodName].overloadTable[argCount-1]=func}return[]});return[]})}function __embind_register_class_constructor(rawClassType,argCount,rawArgTypesAddr,invokerSignature,invoker,rawConstructor){assert(argCount>0);var rawArgTypes=heap32VectorToArray(argCount,rawArgTypesAddr);invoker=embind__requireFunction(invokerSignature,invoker);whenDependentTypesAreResolved([],[rawClassType],function(classType){classType=classType[0];var humanName="constructor "+classType.name;if(undefined===classType.registeredClass.constructor_body){classType.registeredClass.constructor_body=[]}if(undefined!==classType.registeredClass.constructor_body[argCount-1]){throw new BindingError("Cannot register multiple constructors with identical number of parameters ("+(argCount-1)+") for class '"+classType.name+"'! Overload resolution is currently only performed using the parameter count, not actual type info!")}classType.registeredClass.constructor_body[argCount-1]=()=>{throwUnboundTypeError("Cannot construct "+classType.name+" due to unbound types",rawArgTypes)};whenDependentTypesAreResolved([],rawArgTypes,function(argTypes){argTypes.splice(1,0,null);classType.registeredClass.constructor_body[argCount-1]=craftInvokerFunction(humanName,argTypes,null,invoker,rawConstructor);return[]});return[]})}function __embind_register_class_function(rawClassType,methodName,argCount,rawArgTypesAddr,invokerSignature,rawInvoker,context,isPureVirtual){var rawArgTypes=heap32VectorToArray(argCount,rawArgTypesAddr);methodName=readLatin1String(methodName);rawInvoker=embind__requireFunction(invokerSignature,rawInvoker);whenDependentTypesAreResolved([],[rawClassType],function(classType){classType=classType[0];var humanName=classType.name+"."+methodName;if(methodName.startsWith("@@")){methodName=Symbol[methodName.substring(2)]}if(isPureVirtual){classType.registeredClass.pureVirtualFunctions.push(methodName)}function unboundTypesHandler(){throwUnboundTypeError("Cannot call "+humanName+" due to unbound types",rawArgTypes)}var proto=classType.registeredClass.instancePrototype;var method=proto[methodName];if(undefined===method||undefined===method.overloadTable&&method.className!==classType.name&&method.argCount===argCount-2){unboundTypesHandler.argCount=argCount-2;unboundTypesHandler.className=classType.name;proto[methodName]=unboundTypesHandler}else{ensureOverloadTable(proto,methodName,humanName);proto[methodName].overloadTable[argCount-2]=unboundTypesHandler}whenDependentTypesAreResolved([],rawArgTypes,function(argTypes){var memberFunction=craftInvokerFunction(humanName,argTypes,classType,rawInvoker,context);if(undefined===proto[methodName].overloadTable){memberFunction.argCount=argCount-2;proto[methodName]=memberFunction}else{proto[methodName].overloadTable[argCount-2]=memberFunction}return[]});return[]})}function validateThis(this_,classType,humanName){if(!(this_ instanceof Object)){throwBindingError(humanName+' with invalid "this": '+this_)}if(!(this_ instanceof classType.registeredClass.constructor)){throwBindingError(humanName+' incompatible with "this" of type '+this_.constructor.name)}if(!this_.$$.ptr){throwBindingError("cannot call emscripten binding method "+humanName+" on deleted object")}return upcastPointer(this_.$$.ptr,this_.$$.ptrType.registeredClass,classType.registeredClass)}function __embind_register_class_property(classType,fieldName,getterReturnType,getterSignature,getter,getterContext,setterArgumentType,setterSignature,setter,setterContext){fieldName=readLatin1String(fieldName);getter=embind__requireFunction(getterSignature,getter);whenDependentTypesAreResolved([],[classType],function(classType){classType=classType[0];var humanName=classType.name+"."+fieldName;var desc={get:function(){throwUnboundTypeError("Cannot access "+humanName+" due to unbound types",[getterReturnType,setterArgumentType])},enumerable:true,configurable:true};if(setter){desc.set=()=>{throwUnboundTypeError("Cannot access "+humanName+" due to unbound types",[getterReturnType,setterArgumentType])}}else{desc.set=v=>{throwBindingError(humanName+" is a read-only property")}}Object.defineProperty(classType.registeredClass.instancePrototype,fieldName,desc);whenDependentTypesAreResolved([],setter?[getterReturnType,setterArgumentType]:[getterReturnType],function(types){var getterReturnType=types[0];var desc={get:function(){var ptr=validateThis(this,classType,humanName+" getter");return getterReturnType["fromWireType"](getter(getterContext,ptr))},enumerable:true};if(setter){setter=embind__requireFunction(setterSignature,setter);var setterArgumentType=types[1];desc.set=function(v){var ptr=validateThis(this,classType,humanName+" setter");var destructors=[];setter(setterContext,ptr,setterArgumentType["toWireType"](destructors,v));runDestructors(destructors)}}Object.defineProperty(classType.registeredClass.instancePrototype,fieldName,desc);return[]});return[]})}var emval_free_list=[];var emval_handle_array=[{},{value:undefined},{value:null},{value:true},{value:false}];function __emval_decref(handle){if(handle>4&&0===--emval_handle_array[handle].refcount){emval_handle_array[handle]=undefined;emval_free_list.push(handle)}}function count_emval_handles(){var count=0;for(var i=5;i<emval_handle_array.length;++i){if(emval_handle_array[i]!==undefined){++count}}return count}function get_first_emval(){for(var i=5;i<emval_handle_array.length;++i){if(emval_handle_array[i]!==undefined){return emval_handle_array[i]}}return null}function init_emval(){Module["count_emval_handles"]=count_emval_handles;Module["get_first_emval"]=get_first_emval}var Emval={toValue:handle=>{if(!handle){throwBindingError("Cannot use deleted val. handle = "+handle)}return emval_handle_array[handle].value},toHandle:value=>{switch(value){case undefined:return 1;case null:return 2;case true:return 3;case false:return 4;default:{var handle=emval_free_list.length?emval_free_list.pop():emval_handle_array.length;emval_handle_array[handle]={refcount:1,value:value};return handle}}}};function __embind_register_emval(rawType,name){name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":function(handle){var rv=Emval.toValue(handle);__emval_decref(handle);return rv},"toWireType":function(destructors,value){return Emval.toHandle(value)},"argPackAdvance":8,"readValueFromPointer":simpleReadValueFromPointer,destructorFunction:null})}function enumReadValueFromPointer(name,shift,signed){switch(shift){case 0:return function(pointer){var heap=signed?HEAP8:HEAPU8;return this["fromWireType"](heap[pointer>>>0])};case 1:return function(pointer){var heap=signed?HEAP16:HEAPU16;return this["fromWireType"](heap[pointer>>>1])};case 2:return function(pointer){var heap=signed?HEAP32:HEAPU32;return this["fromWireType"](heap[pointer>>>2])};default:throw new TypeError("Unknown integer type: "+name)}}function __embind_register_enum(rawType,name,size,isSigned){var shift=getShiftFromSize(size);name=readLatin1String(name);function ctor(){}ctor.values={};registerType(rawType,{name:name,constructor:ctor,"fromWireType":function(c){return this.constructor.values[c]},"toWireType":function(destructors,c){return c.value},"argPackAdvance":8,"readValueFromPointer":enumReadValueFromPointer(name,shift,isSigned),destructorFunction:null});exposePublicSymbol(name,ctor)}function requireRegisteredType(rawType,humanName){var impl=registeredTypes[rawType];if(undefined===impl){throwBindingError(humanName+" has unknown type "+getTypeName(rawType))}return impl}function __embind_register_enum_value(rawEnumType,name,enumValue){var enumType=requireRegisteredType(rawEnumType,"enum");name=readLatin1String(name);var Enum=enumType.constructor;var Value=Object.create(enumType.constructor.prototype,{value:{value:enumValue},constructor:{value:createNamedFunction(enumType.name+"_"+name,function(){})}});Enum.values[enumValue]=Value;Enum[name]=Value}function _embind_repr(v){if(v===null){return"null"}var t=typeof v;if(t==="object"||t==="array"||t==="function"){return v.toString()}else{return""+v}}function floatReadValueFromPointer(name,shift){switch(shift){case 2:return function(pointer){return this["fromWireType"](HEAPF32[pointer>>>2])};case 3:return function(pointer){return this["fromWireType"](HEAPF64[pointer>>>3])};default:throw new TypeError("Unknown float type: "+name)}}function __embind_register_float(rawType,name,size){var shift=getShiftFromSize(size);name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":function(value){return value},"toWireType":function(destructors,value){return value},"argPackAdvance":8,"readValueFromPointer":floatReadValueFromPointer(name,shift),destructorFunction:null})}function integerReadValueFromPointer(name,shift,signed){switch(shift){case 0:return signed?function readS8FromPointer(pointer){return HEAP8[pointer>>>0]}:function readU8FromPointer(pointer){return HEAPU8[pointer>>>0]};case 1:return signed?function readS16FromPointer(pointer){return HEAP16[pointer>>>1]}:function readU16FromPointer(pointer){return HEAPU16[pointer>>>1]};case 2:return signed?function readS32FromPointer(pointer){return HEAP32[pointer>>>2]}:function readU32FromPointer(pointer){return HEAPU32[pointer>>>2]};default:throw new TypeError("Unknown integer type: "+name)}}function __embind_register_integer(primitiveType,name,size,minRange,maxRange){name=readLatin1String(name);if(maxRange===-1){maxRange=4294967295}var shift=getShiftFromSize(size);var fromWireType=value=>value;if(minRange===0){var bitshift=32-8*size;fromWireType=value=>value<<bitshift>>>bitshift}var isUnsignedType=name.includes("unsigned");var checkAssertions=(value,toTypeName)=>{};var toWireType;if(isUnsignedType){toWireType=function(destructors,value){checkAssertions(value,this.name);return value>>>0}}else{toWireType=function(destructors,value){checkAssertions(value,this.name);return value}}registerType(primitiveType,{name:name,"fromWireType":fromWireType,"toWireType":toWireType,"argPackAdvance":8,"readValueFromPointer":integerReadValueFromPointer(name,shift,minRange!==0),destructorFunction:null})}function __embind_register_memory_view(rawType,dataTypeIndex,name){var typeMapping=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array];var TA=typeMapping[dataTypeIndex];function decodeMemoryView(handle){handle=handle>>2;var heap=HEAPU32;var size=heap[handle>>>0];var data=heap[handle+1>>>0];return new TA(buffer,data,size)}name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":decodeMemoryView,"argPackAdvance":8,"readValueFromPointer":decodeMemoryView},{ignoreDuplicateRegistrations:true})}function __embind_register_std_string(rawType,name){name=readLatin1String(name);var stdStringIsUTF8=name==="std::string";registerType(rawType,{name:name,"fromWireType":function(value){var length=HEAPU32[value>>>2];var str;if(stdStringIsUTF8){var decodeStartPtr=value+4;for(var i=0;i<=length;++i){var currentBytePtr=value+4+i;if(i==length||HEAPU8[currentBytePtr>>>0]==0){var maxRead=currentBytePtr-decodeStartPtr;var stringSegment=UTF8ToString(decodeStartPtr,maxRead);if(str===undefined){str=stringSegment}else{str+=String.fromCharCode(0);str+=stringSegment}decodeStartPtr=currentBytePtr+1}}}else{var a=new Array(length);for(var i=0;i<length;++i){a[i]=String.fromCharCode(HEAPU8[value+4+i>>>0])}str=a.join("")}_free(value);return str},"toWireType":function(destructors,value){if(value instanceof ArrayBuffer){value=new Uint8Array(value)}var getLength;var valueIsOfTypeString=typeof value=="string";if(!(valueIsOfTypeString||value instanceof Uint8Array||value instanceof Uint8ClampedArray||value instanceof Int8Array)){throwBindingError("Cannot pass non-string to std::string")}if(stdStringIsUTF8&&valueIsOfTypeString){getLength=()=>lengthBytesUTF8(value)}else{getLength=()=>value.length}var length=getLength();var ptr=_malloc(4+length+1);ptr>>>=0;HEAPU32[ptr>>>2]=length;if(stdStringIsUTF8&&valueIsOfTypeString){stringToUTF8(value,ptr+4,length+1)}else{if(valueIsOfTypeString){for(var i=0;i<length;++i){var charCode=value.charCodeAt(i);if(charCode>255){_free(ptr);throwBindingError("String has UTF-16 code units that do not fit in 8 bits")}HEAPU8[ptr+4+i>>>0]=charCode}}else{for(var i=0;i<length;++i){HEAPU8[ptr+4+i>>>0]=value[i]}}}if(destructors!==null){destructors.push(_free,ptr)}return ptr},"argPackAdvance":8,"readValueFromPointer":simpleReadValueFromPointer,destructorFunction:function(ptr){_free(ptr)}})}function __embind_register_std_wstring(rawType,charSize,name){name=readLatin1String(name);var decodeString,encodeString,getHeap,lengthBytesUTF,shift;if(charSize===2){decodeString=UTF16ToString;encodeString=stringToUTF16;lengthBytesUTF=lengthBytesUTF16;getHeap=()=>HEAPU16;shift=1}else if(charSize===4){decodeString=UTF32ToString;encodeString=stringToUTF32;lengthBytesUTF=lengthBytesUTF32;getHeap=()=>HEAPU32;shift=2}registerType(rawType,{name:name,"fromWireType":function(value){var length=HEAPU32[value>>>2];var HEAP=getHeap();var str;var decodeStartPtr=value+4;for(var i=0;i<=length;++i){var currentBytePtr=value+4+i*charSize;if(i==length||HEAP[currentBytePtr>>>shift]==0){var maxReadBytes=currentBytePtr-decodeStartPtr;var stringSegment=decodeString(decodeStartPtr,maxReadBytes);if(str===undefined){str=stringSegment}else{str+=String.fromCharCode(0);str+=stringSegment}decodeStartPtr=currentBytePtr+charSize}}_free(value);return str},"toWireType":function(destructors,value){if(!(typeof value=="string")){throwBindingError("Cannot pass non-string to C++ string type "+name)}var length=lengthBytesUTF(value);var ptr=_malloc(4+length+charSize);ptr>>>=0;HEAPU32[ptr>>>2]=length>>shift;encodeString(value,ptr+4,length+charSize);if(destructors!==null){destructors.push(_free,ptr)}return ptr},"argPackAdvance":8,"readValueFromPointer":simpleReadValueFromPointer,destructorFunction:function(ptr){_free(ptr)}})}function __embind_register_void(rawType,name){name=readLatin1String(name);registerType(rawType,{isVoid:true,name:name,"argPackAdvance":0,"fromWireType":function(){return undefined},"toWireType":function(destructors,o){return undefined}})}function __emscripten_date_now(){return Date.now()}var nowIsMonotonic=true;function __emscripten_get_now_is_monotonic(){return nowIsMonotonic}function __emval_as(handle,returnType,destructorsRef){handle=Emval.toValue(handle);returnType=requireRegisteredType(returnType,"emval::as");var destructors=[];var rd=Emval.toHandle(destructors);HEAP32[destructorsRef>>>2]=rd;return returnType["toWireType"](destructors,handle)}function emval_allocateDestructors(destructorsRef){var destructors=[];HEAP32[destructorsRef>>>2]=Emval.toHandle(destructors);return destructors}var emval_symbols={};function getStringOrSymbol(address){var symbol=emval_symbols[address];if(symbol===undefined){return readLatin1String(address)}return symbol}var emval_methodCallers=[];function __emval_call_method(caller,handle,methodName,destructorsRef,args){caller=emval_methodCallers[caller];handle=Emval.toValue(handle);methodName=getStringOrSymbol(methodName);return caller(handle,methodName,emval_allocateDestructors(destructorsRef),args)}function emval_get_global(){if(typeof globalThis=="object"){return globalThis}return function(){return Function}()("return this")()}function __emval_get_global(name){if(name===0){return Emval.toHandle(emval_get_global())}else{name=getStringOrSymbol(name);return Emval.toHandle(emval_get_global()[name])}}function emval_addMethodCaller(caller){var id=emval_methodCallers.length;emval_methodCallers.push(caller);return id}function emval_lookupTypes(argCount,argTypes){var a=new Array(argCount);for(var i=0;i<argCount;++i){a[i]=requireRegisteredType(HEAPU32[argTypes+i*POINTER_SIZE>>>2],"parameter "+i)}return a}var emval_registeredMethods=[];function __emval_get_method_caller(argCount,argTypes){var types=emval_lookupTypes(argCount,argTypes);var retType=types[0];var signatureName=retType.name+"_$"+types.slice(1).map(function(t){return t.name}).join("_")+"$";var returnId=emval_registeredMethods[signatureName];if(returnId!==undefined){return returnId}var params=["retType"];var args=[retType];var argsList="";for(var i=0;i<argCount-1;++i){argsList+=(i!==0?", ":"")+"arg"+i;params.push("argType"+i);args.push(types[1+i])}var functionName=makeLegalFunctionName("methodCaller_"+signatureName);var functionBody="return function "+functionName+"(handle, name, destructors, args) {\n";var offset=0;for(var i=0;i<argCount-1;++i){functionBody+="    var arg"+i+" = argType"+i+".readValueFromPointer(args"+(offset?"+"+offset:"")+");\n";offset+=types[i+1]["argPackAdvance"]}functionBody+="    var rv = handle[name]("+argsList+");\n";for(var i=0;i<argCount-1;++i){if(types[i+1]["deleteObject"]){functionBody+="    argType"+i+".deleteObject(arg"+i+");\n"}}if(!retType.isVoid){functionBody+="    return retType.toWireType(destructors, rv);\n"}functionBody+="};\n";params.push(functionBody);var invokerFunction=new_(Function,params).apply(null,args);returnId=emval_addMethodCaller(invokerFunction);emval_registeredMethods[signatureName]=returnId;return returnId}function __emval_get_property(handle,key){handle=Emval.toValue(handle);key=Emval.toValue(key);return Emval.toHandle(handle[key])}function __emval_incref(handle){if(handle>4){emval_handle_array[handle].refcount+=1}}function __emval_new_cstring(v){return Emval.toHandle(getStringOrSymbol(v))}function __emval_run_destructors(handle){var destructors=Emval.toValue(handle);runDestructors(destructors);__emval_decref(handle)}function __emval_set_property(handle,key,value){handle=Emval.toValue(handle);key=Emval.toValue(key);value=Emval.toValue(value);handle[key]=value}function __emval_take_value(type,argv){type=requireRegisteredType(type,"_emval_take_value");var v=type["readValueFromPointer"](argv);return Emval.toHandle(v)}function __emval_typeof(handle){handle=Emval.toValue(handle);return Emval.toHandle(typeof handle)}function __localtime_js(time,tmPtr){var date=new Date(HEAP32[time>>>2]*1e3);HEAP32[tmPtr>>>2]=date.getSeconds();HEAP32[tmPtr+4>>>2]=date.getMinutes();HEAP32[tmPtr+8>>>2]=date.getHours();HEAP32[tmPtr+12>>>2]=date.getDate();HEAP32[tmPtr+16>>>2]=date.getMonth();HEAP32[tmPtr+20>>>2]=date.getFullYear()-1900;HEAP32[tmPtr+24>>>2]=date.getDay();var start=new Date(date.getFullYear(),0,1);var yday=(date.getTime()-start.getTime())/(1e3*60*60*24)|0;HEAP32[tmPtr+28>>>2]=yday;HEAP32[tmPtr+36>>>2]=-(date.getTimezoneOffset()*60);var summerOffset=new Date(date.getFullYear(),6,1).getTimezoneOffset();var winterOffset=start.getTimezoneOffset();var dst=(summerOffset!=winterOffset&&date.getTimezoneOffset()==Math.min(winterOffset,summerOffset))|0;HEAP32[tmPtr+32>>>2]=dst}function __munmap_js(addr,len,prot,flags,fd,offset){try{addr>>>=0;var stream=FS.getStream(fd);if(stream){if(prot&2){SYSCALLS.doMsync(addr,stream,len,flags,offset)}FS.munmap(stream)}}catch(e){if(typeof FS=="undefined"||!(e instanceof FS.ErrnoError))throw e;return-e.errno}}function _tzset_impl(timezone,daylight,tzname){var currentYear=(new Date).getFullYear();var winter=new Date(currentYear,0,1);var summer=new Date(currentYear,6,1);var winterOffset=winter.getTimezoneOffset();var summerOffset=summer.getTimezoneOffset();var stdTimezoneOffset=Math.max(winterOffset,summerOffset);HEAP32[timezone>>>2]=stdTimezoneOffset*60;HEAP32[daylight>>>2]=Number(winterOffset!=summerOffset);function extractZone(date){var match=date.toTimeString().match(/\(([A-Za-z ]+)\)$/);return match?match[1]:"GMT"}var winterName=extractZone(winter);var summerName=extractZone(summer);var winterNamePtr=allocateUTF8(winterName);var summerNamePtr=allocateUTF8(summerName);if(summerOffset<winterOffset){HEAPU32[tzname>>>2]=winterNamePtr;HEAPU32[tzname+4>>>2]=summerNamePtr}else{HEAPU32[tzname>>>2]=summerNamePtr;HEAPU32[tzname+4>>>2]=winterNamePtr}}function __tzset_js(timezone,daylight,tzname){if(__tzset_js.called)return;__tzset_js.called=true;_tzset_impl(timezone,daylight,tzname)}function _abort(){abort("")}function _emscripten_set_main_loop_timing(mode,value){Browser.mainLoop.timingMode=mode;Browser.mainLoop.timingValue=value;if(!Browser.mainLoop.func){return 1}if(!Browser.mainLoop.running){Browser.mainLoop.running=true}if(mode==0){Browser.mainLoop.scheduler=function Browser_mainLoop_scheduler_setTimeout(){var timeUntilNextTick=Math.max(0,Browser.mainLoop.tickStartTime+value-_emscripten_get_now())|0;setTimeout(Browser.mainLoop.runner,timeUntilNextTick)};Browser.mainLoop.method="timeout"}else if(mode==1){Browser.mainLoop.scheduler=function Browser_mainLoop_scheduler_rAF(){Browser.requestAnimationFrame(Browser.mainLoop.runner)};Browser.mainLoop.method="rAF"}else if(mode==2){if(typeof setImmediate=="undefined"){var setImmediates=[];var emscriptenMainLoopMessageId="setimmediate";var Browser_setImmediate_messageHandler=function(event){if(event.data===emscriptenMainLoopMessageId||event.data.target===emscriptenMainLoopMessageId){event.stopPropagation();setImmediates.shift()()}};addEventListener("message",Browser_setImmediate_messageHandler,true);setImmediate=function Browser_emulated_setImmediate(func){setImmediates.push(func);if(ENVIRONMENT_IS_WORKER){if(Module["setImmediates"]===undefined)Module["setImmediates"]=[];Module["setImmediates"].push(func);postMessage({target:emscriptenMainLoopMessageId})}else postMessage(emscriptenMainLoopMessageId,"*")}}Browser.mainLoop.scheduler=function Browser_mainLoop_scheduler_setImmediate(){setImmediate(Browser.mainLoop.runner)};Browser.mainLoop.method="immediate"}return 0}var _emscripten_get_now;if(ENVIRONMENT_IS_NODE){_emscripten_get_now=()=>{var t=process["hrtime"]();return t[0]*1e3+t[1]/1e6}}else _emscripten_get_now=()=>performance.now();function _exit(status){exit(status)}function maybeExit(){}function setMainLoop(browserIterationFunc,fps,simulateInfiniteLoop,arg,noSetTiming){assert(!Browser.mainLoop.func,"emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.");Browser.mainLoop.func=browserIterationFunc;Browser.mainLoop.arg=arg;var thisMainLoopId=Browser.mainLoop.currentlyRunningMainloop;function checkIsRunning(){if(thisMainLoopId<Browser.mainLoop.currentlyRunningMainloop){maybeExit();return false}return true}Browser.mainLoop.running=false;Browser.mainLoop.runner=function Browser_mainLoop_runner(){if(ABORT)return;if(Browser.mainLoop.queue.length>0){var start=Date.now();var blocker=Browser.mainLoop.queue.shift();blocker.func(blocker.arg);if(Browser.mainLoop.remainingBlockers){var remaining=Browser.mainLoop.remainingBlockers;var next=remaining%1==0?remaining-1:Math.floor(remaining);if(blocker.counted){Browser.mainLoop.remainingBlockers=next}else{next=next+.5;Browser.mainLoop.remainingBlockers=(8*remaining+next)/9}}out('main loop blocker "'+blocker.name+'" took '+(Date.now()-start)+" ms");Browser.mainLoop.updateStatus();if(!checkIsRunning())return;setTimeout(Browser.mainLoop.runner,0);return}if(!checkIsRunning())return;Browser.mainLoop.currentFrameNumber=Browser.mainLoop.currentFrameNumber+1|0;if(Browser.mainLoop.timingMode==1&&Browser.mainLoop.timingValue>1&&Browser.mainLoop.currentFrameNumber%Browser.mainLoop.timingValue!=0){Browser.mainLoop.scheduler();return}else if(Browser.mainLoop.timingMode==0){Browser.mainLoop.tickStartTime=_emscripten_get_now()}Browser.mainLoop.runIter(browserIterationFunc);if(!checkIsRunning())return;if(typeof SDL=="object"&&SDL.audio&&SDL.audio.queueNewAudioData)SDL.audio.queueNewAudioData();Browser.mainLoop.scheduler()};if(!noSetTiming){if(fps&&fps>0)_emscripten_set_main_loop_timing(0,1e3/fps);else _emscripten_set_main_loop_timing(1,1);Browser.mainLoop.scheduler()}if(simulateInfiniteLoop){throw"unwind"}}function callUserCallback(func,synchronous){if(ABORT){return}if(synchronous){func();return}try{func()}catch(e){handleException(e)}}function safeSetTimeout(func,timeout){return setTimeout(function(){callUserCallback(func)},timeout)}var Browser={mainLoop:{running:false,scheduler:null,method:"",currentlyRunningMainloop:0,func:null,arg:0,timingMode:0,timingValue:0,currentFrameNumber:0,queue:[],pause:function(){Browser.mainLoop.scheduler=null;Browser.mainLoop.currentlyRunningMainloop++},resume:function(){Browser.mainLoop.currentlyRunningMainloop++;var timingMode=Browser.mainLoop.timingMode;var timingValue=Browser.mainLoop.timingValue;var func=Browser.mainLoop.func;Browser.mainLoop.func=null;setMainLoop(func,0,false,Browser.mainLoop.arg,true);_emscripten_set_main_loop_timing(timingMode,timingValue);Browser.mainLoop.scheduler()},updateStatus:function(){if(Module["setStatus"]){var message=Module["statusMessage"]||"Please wait...";var remaining=Browser.mainLoop.remainingBlockers;var expected=Browser.mainLoop.expectedBlockers;if(remaining){if(remaining<expected){Module["setStatus"](message+" ("+(expected-remaining)+"/"+expected+")")}else{Module["setStatus"](message)}}else{Module["setStatus"]("")}}},runIter:function(func){if(ABORT)return;if(Module["preMainLoop"]){var preRet=Module["preMainLoop"]();if(preRet===false){return}}callUserCallback(func);if(Module["postMainLoop"])Module["postMainLoop"]()}},isFullscreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function(){if(!Module["preloadPlugins"])Module["preloadPlugins"]=[];if(Browser.initted)return;Browser.initted=true;try{new Blob;Browser.hasBlobConstructor=true}catch(e){Browser.hasBlobConstructor=false;out("warning: no blob constructor, cannot create blobs with mimetypes")}Browser.BlobBuilder=typeof MozBlobBuilder!="undefined"?MozBlobBuilder:typeof WebKitBlobBuilder!="undefined"?WebKitBlobBuilder:!Browser.hasBlobConstructor?out("warning: no BlobBuilder"):null;Browser.URLObject=typeof window!="undefined"?window.URL?window.URL:window.webkitURL:undefined;if(!Module.noImageDecoding&&typeof Browser.URLObject=="undefined"){out("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");Module.noImageDecoding=true}var imagePlugin={};imagePlugin["canHandle"]=function imagePlugin_canHandle(name){return!Module.noImageDecoding&&/\.(jpg|jpeg|png|bmp)$/i.test(name)};imagePlugin["handle"]=function imagePlugin_handle(byteArray,name,onload,onerror){var b=null;if(Browser.hasBlobConstructor){try{b=new Blob([byteArray],{type:Browser.getMimetype(name)});if(b.size!==byteArray.length){b=new Blob([new Uint8Array(byteArray).buffer],{type:Browser.getMimetype(name)})}}catch(e){warnOnce("Blob constructor present but fails: "+e+"; falling back to blob builder")}}if(!b){var bb=new Browser.BlobBuilder;bb.append(new Uint8Array(byteArray).buffer);b=bb.getBlob()}var url=Browser.URLObject.createObjectURL(b);var img=new Image;img.onload=()=>{assert(img.complete,"Image "+name+" could not be decoded");var canvas=document.createElement("canvas");canvas.width=img.width;canvas.height=img.height;var ctx=canvas.getContext("2d");ctx.drawImage(img,0,0);preloadedImages[name]=canvas;Browser.URLObject.revokeObjectURL(url);if(onload)onload(byteArray)};img.onerror=event=>{out("Image "+url+" could not be decoded");if(onerror)onerror()};img.src=url};Module["preloadPlugins"].push(imagePlugin);var audioPlugin={};audioPlugin["canHandle"]=function audioPlugin_canHandle(name){return!Module.noAudioDecoding&&name.substr(-4)in{".ogg":1,".wav":1,".mp3":1}};audioPlugin["handle"]=function audioPlugin_handle(byteArray,name,onload,onerror){var done=false;function finish(audio){if(done)return;done=true;preloadedAudios[name]=audio;if(onload)onload(byteArray)}function fail(){if(done)return;done=true;preloadedAudios[name]=new Audio;if(onerror)onerror()}if(Browser.hasBlobConstructor){try{var b=new Blob([byteArray],{type:Browser.getMimetype(name)})}catch(e){return fail()}var url=Browser.URLObject.createObjectURL(b);var audio=new Audio;audio.addEventListener("canplaythrough",function(){finish(audio)},false);audio.onerror=function audio_onerror(event){if(done)return;out("warning: browser could not fully decode audio "+name+", trying slower base64 approach");function encode64(data){var BASE="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var PAD="=";var ret="";var leftchar=0;var leftbits=0;for(var i=0;i<data.length;i++){leftchar=leftchar<<8|data[i];leftbits+=8;while(leftbits>=6){var curr=leftchar>>leftbits-6&63;leftbits-=6;ret+=BASE[curr]}}if(leftbits==2){ret+=BASE[(leftchar&3)<<4];ret+=PAD+PAD}else if(leftbits==4){ret+=BASE[(leftchar&15)<<2];ret+=PAD}return ret}audio.src="data:audio/x-"+name.substr(-3)+";base64,"+encode64(byteArray);finish(audio)};audio.src=url;safeSetTimeout(function(){finish(audio)},1e4)}else{return fail()}};Module["preloadPlugins"].push(audioPlugin);function pointerLockChange(){Browser.pointerLock=document["pointerLockElement"]===Module["canvas"]||document["mozPointerLockElement"]===Module["canvas"]||document["webkitPointerLockElement"]===Module["canvas"]||document["msPointerLockElement"]===Module["canvas"]}var canvas=Module["canvas"];if(canvas){canvas.requestPointerLock=canvas["requestPointerLock"]||canvas["mozRequestPointerLock"]||canvas["webkitRequestPointerLock"]||canvas["msRequestPointerLock"]||function(){};canvas.exitPointerLock=document["exitPointerLock"]||document["mozExitPointerLock"]||document["webkitExitPointerLock"]||document["msExitPointerLock"]||function(){};canvas.exitPointerLock=canvas.exitPointerLock.bind(document);document.addEventListener("pointerlockchange",pointerLockChange,false);document.addEventListener("mozpointerlockchange",pointerLockChange,false);document.addEventListener("webkitpointerlockchange",pointerLockChange,false);document.addEventListener("mspointerlockchange",pointerLockChange,false);if(Module["elementPointerLock"]){canvas.addEventListener("click",function(ev){if(!Browser.pointerLock&&Module["canvas"].requestPointerLock){Module["canvas"].requestPointerLock();ev.preventDefault()}},false)}}},handledByPreloadPlugin:function(byteArray,fullname,finish,onerror){Browser.init();var handled=false;Module["preloadPlugins"].forEach(function(plugin){if(handled)return;if(plugin["canHandle"](fullname)){plugin["handle"](byteArray,fullname,finish,onerror);handled=true}});return handled},createContext:function(canvas,useWebGL,setInModule,webGLContextAttributes){if(useWebGL&&Module.ctx&&canvas==Module.canvas)return Module.ctx;var ctx;var contextHandle;if(useWebGL){var contextAttributes={antialias:false,alpha:false,majorVersion:1};if(webGLContextAttributes){for(var attribute in webGLContextAttributes){contextAttributes[attribute]=webGLContextAttributes[attribute]}}if(typeof GL!="undefined"){contextHandle=GL.createContext(canvas,contextAttributes);if(contextHandle){ctx=GL.getContext(contextHandle).GLctx}}}else{ctx=canvas.getContext("2d")}if(!ctx)return null;if(setInModule){if(!useWebGL)assert(typeof GLctx=="undefined","cannot set in module if GLctx is used, but we are a non-GL context that would replace it");Module.ctx=ctx;if(useWebGL)GL.makeContextCurrent(contextHandle);Module.useWebGL=useWebGL;Browser.moduleContextCreatedCallbacks.forEach(function(callback){callback()});Browser.init()}return ctx},destroyContext:function(canvas,useWebGL,setInModule){},fullscreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullscreen:function(lockPointer,resizeCanvas){Browser.lockPointer=lockPointer;Browser.resizeCanvas=resizeCanvas;if(typeof Browser.lockPointer=="undefined")Browser.lockPointer=true;if(typeof Browser.resizeCanvas=="undefined")Browser.resizeCanvas=false;var canvas=Module["canvas"];function fullscreenChange(){Browser.isFullscreen=false;var canvasContainer=canvas.parentNode;if((document["fullscreenElement"]||document["mozFullScreenElement"]||document["msFullscreenElement"]||document["webkitFullscreenElement"]||document["webkitCurrentFullScreenElement"])===canvasContainer){canvas.exitFullscreen=Browser.exitFullscreen;if(Browser.lockPointer)canvas.requestPointerLock();Browser.isFullscreen=true;if(Browser.resizeCanvas){Browser.setFullscreenCanvasSize()}else{Browser.updateCanvasDimensions(canvas)}}else{canvasContainer.parentNode.insertBefore(canvas,canvasContainer);canvasContainer.parentNode.removeChild(canvasContainer);if(Browser.resizeCanvas){Browser.setWindowedCanvasSize()}else{Browser.updateCanvasDimensions(canvas)}}if(Module["onFullScreen"])Module["onFullScreen"](Browser.isFullscreen);if(Module["onFullscreen"])Module["onFullscreen"](Browser.isFullscreen)}if(!Browser.fullscreenHandlersInstalled){Browser.fullscreenHandlersInstalled=true;document.addEventListener("fullscreenchange",fullscreenChange,false);document.addEventListener("mozfullscreenchange",fullscreenChange,false);document.addEventListener("webkitfullscreenchange",fullscreenChange,false);document.addEventListener("MSFullscreenChange",fullscreenChange,false)}var canvasContainer=document.createElement("div");canvas.parentNode.insertBefore(canvasContainer,canvas);canvasContainer.appendChild(canvas);canvasContainer.requestFullscreen=canvasContainer["requestFullscreen"]||canvasContainer["mozRequestFullScreen"]||canvasContainer["msRequestFullscreen"]||(canvasContainer["webkitRequestFullscreen"]?function(){canvasContainer["webkitRequestFullscreen"](Element["ALLOW_KEYBOARD_INPUT"])}:null)||(canvasContainer["webkitRequestFullScreen"]?function(){canvasContainer["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"])}:null);canvasContainer.requestFullscreen()},exitFullscreen:function(){if(!Browser.isFullscreen){return false}var CFS=document["exitFullscreen"]||document["cancelFullScreen"]||document["mozCancelFullScreen"]||document["msExitFullscreen"]||document["webkitCancelFullScreen"]||function(){};CFS.apply(document,[]);return true},nextRAF:0,fakeRequestAnimationFrame:function(func){var now=Date.now();if(Browser.nextRAF===0){Browser.nextRAF=now+1e3/60}else{while(now+2>=Browser.nextRAF){Browser.nextRAF+=1e3/60}}var delay=Math.max(Browser.nextRAF-now,0);setTimeout(func,delay)},requestAnimationFrame:function(func){if(typeof requestAnimationFrame=="function"){requestAnimationFrame(func);return}var RAF=Browser.fakeRequestAnimationFrame;RAF(func)},safeSetTimeout:function(func){return safeSetTimeout(func)},safeRequestAnimationFrame:function(func){return Browser.requestAnimationFrame(function(){callUserCallback(func)})},getMimetype:function(name){return{"jpg":"image/jpeg","jpeg":"image/jpeg","png":"image/png","bmp":"image/bmp","ogg":"audio/ogg","wav":"audio/wav","mp3":"audio/mpeg"}[name.substr(name.lastIndexOf(".")+1)]},getUserMedia:function(func){if(!window.getUserMedia){window.getUserMedia=navigator["getUserMedia"]||navigator["mozGetUserMedia"]}window.getUserMedia(func)},getMovementX:function(event){return event["movementX"]||event["mozMovementX"]||event["webkitMovementX"]||0},getMovementY:function(event){return event["movementY"]||event["mozMovementY"]||event["webkitMovementY"]||0},getMouseWheelDelta:function(event){var delta=0;switch(event.type){case"DOMMouseScroll":delta=event.detail/3;break;case"mousewheel":delta=event.wheelDelta/120;break;case"wheel":delta=event.deltaY;switch(event.deltaMode){case 0:delta/=100;break;case 1:delta/=3;break;case 2:delta*=80;break;default:throw"unrecognized mouse wheel delta mode: "+event.deltaMode}break;default:throw"unrecognized mouse wheel event: "+event.type}return delta},mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,touches:{},lastTouches:{},calculateMouseEvent:function(event){if(Browser.pointerLock){if(event.type!="mousemove"&&"mozMovementX"in event){Browser.mouseMovementX=Browser.mouseMovementY=0}else{Browser.mouseMovementX=Browser.getMovementX(event);Browser.mouseMovementY=Browser.getMovementY(event)}if(typeof SDL!="undefined"){Browser.mouseX=SDL.mouseX+Browser.mouseMovementX;Browser.mouseY=SDL.mouseY+Browser.mouseMovementY}else{Browser.mouseX+=Browser.mouseMovementX;Browser.mouseY+=Browser.mouseMovementY}}else{var rect=Module["canvas"].getBoundingClientRect();var cw=Module["canvas"].width;var ch=Module["canvas"].height;var scrollX=typeof window.scrollX!="undefined"?window.scrollX:window.pageXOffset;var scrollY=typeof window.scrollY!="undefined"?window.scrollY:window.pageYOffset;if(event.type==="touchstart"||event.type==="touchend"||event.type==="touchmove"){var touch=event.touch;if(touch===undefined){return}var adjustedX=touch.pageX-(scrollX+rect.left);var adjustedY=touch.pageY-(scrollY+rect.top);adjustedX=adjustedX*(cw/rect.width);adjustedY=adjustedY*(ch/rect.height);var coords={x:adjustedX,y:adjustedY};if(event.type==="touchstart"){Browser.lastTouches[touch.identifier]=coords;Browser.touches[touch.identifier]=coords}else if(event.type==="touchend"||event.type==="touchmove"){var last=Browser.touches[touch.identifier];if(!last)last=coords;Browser.lastTouches[touch.identifier]=last;Browser.touches[touch.identifier]=coords}return}var x=event.pageX-(scrollX+rect.left);var y=event.pageY-(scrollY+rect.top);x=x*(cw/rect.width);y=y*(ch/rect.height);Browser.mouseMovementX=x-Browser.mouseX;Browser.mouseMovementY=y-Browser.mouseY;Browser.mouseX=x;Browser.mouseY=y}},resizeListeners:[],updateResizeListeners:function(){var canvas=Module["canvas"];Browser.resizeListeners.forEach(function(listener){listener(canvas.width,canvas.height)})},setCanvasSize:function(width,height,noUpdates){var canvas=Module["canvas"];Browser.updateCanvasDimensions(canvas,width,height);if(!noUpdates)Browser.updateResizeListeners()},windowedWidth:0,windowedHeight:0,setFullscreenCanvasSize:function(){if(typeof SDL!="undefined"){var flags=HEAPU32[SDL.screen>>>2];flags=flags|8388608;HEAP32[SDL.screen>>>2]=flags}Browser.updateCanvasDimensions(Module["canvas"]);Browser.updateResizeListeners()},setWindowedCanvasSize:function(){if(typeof SDL!="undefined"){var flags=HEAPU32[SDL.screen>>>2];flags=flags&~8388608;HEAP32[SDL.screen>>>2]=flags}Browser.updateCanvasDimensions(Module["canvas"]);Browser.updateResizeListeners()},updateCanvasDimensions:function(canvas,wNative,hNative){if(wNative&&hNative){canvas.widthNative=wNative;canvas.heightNative=hNative}else{wNative=canvas.widthNative;hNative=canvas.heightNative}var w=wNative;var h=hNative;if(Module["forcedAspectRatio"]&&Module["forcedAspectRatio"]>0){if(w/h<Module["forcedAspectRatio"]){w=Math.round(h*Module["forcedAspectRatio"])}else{h=Math.round(w/Module["forcedAspectRatio"])}}if((document["fullscreenElement"]||document["mozFullScreenElement"]||document["msFullscreenElement"]||document["webkitFullscreenElement"]||document["webkitCurrentFullScreenElement"])===canvas.parentNode&&typeof screen!="undefined"){var factor=Math.min(screen.width/w,screen.height/h);w=Math.round(w*factor);h=Math.round(h*factor)}if(Browser.resizeCanvas){if(canvas.width!=w)canvas.width=w;if(canvas.height!=h)canvas.height=h;if(typeof canvas.style!="undefined"){canvas.style.removeProperty("width");canvas.style.removeProperty("height")}}else{if(canvas.width!=wNative)canvas.width=wNative;if(canvas.height!=hNative)canvas.height=hNative;if(typeof canvas.style!="undefined"){if(w!=wNative||h!=hNative){canvas.style.setProperty("width",w+"px","important");canvas.style.setProperty("height",h+"px","important")}else{canvas.style.removeProperty("width");canvas.style.removeProperty("height")}}}}};var EGL={errorCode:12288,defaultDisplayInitialized:false,currentContext:0,currentReadSurface:0,currentDrawSurface:0,contextAttributes:{alpha:false,depth:false,stencil:false,antialias:false},stringCache:{},setErrorCode:function(code){EGL.errorCode=code},chooseConfig:function(display,attribList,config,config_size,numConfigs){if(display!=62e3){EGL.setErrorCode(12296);return 0}if(attribList){for(;;){var param=HEAP32[attribList>>>2];if(param==12321){var alphaSize=HEAP32[attribList+4>>>2];EGL.contextAttributes.alpha=alphaSize>0}else if(param==12325){var depthSize=HEAP32[attribList+4>>>2];EGL.contextAttributes.depth=depthSize>0}else if(param==12326){var stencilSize=HEAP32[attribList+4>>>2];EGL.contextAttributes.stencil=stencilSize>0}else if(param==12337){var samples=HEAP32[attribList+4>>>2];EGL.contextAttributes.antialias=samples>0}else if(param==12338){var samples=HEAP32[attribList+4>>>2];EGL.contextAttributes.antialias=samples==1}else if(param==12544){var requestedPriority=HEAP32[attribList+4>>>2];EGL.contextAttributes.lowLatency=requestedPriority!=12547}else if(param==12344){break}attribList+=8}}if((!config||!config_size)&&!numConfigs){EGL.setErrorCode(12300);return 0}if(numConfigs){HEAP32[numConfigs>>>2]=1}if(config&&config_size>0){HEAP32[config>>>2]=62002}EGL.setErrorCode(12288);return 1}};function _eglBindAPI(api){if(api==12448){EGL.setErrorCode(12288);return 1}else{EGL.setErrorCode(12300);return 0}}function _eglChooseConfig(display,attrib_list,configs,config_size,numConfigs){return EGL.chooseConfig(display,attrib_list,configs,config_size,numConfigs)}function __webgl_enable_ANGLE_instanced_arrays(ctx){var ext=ctx.getExtension("ANGLE_instanced_arrays");if(ext){ctx["vertexAttribDivisor"]=function(index,divisor){ext["vertexAttribDivisorANGLE"](index,divisor)};ctx["drawArraysInstanced"]=function(mode,first,count,primcount){ext["drawArraysInstancedANGLE"](mode,first,count,primcount)};ctx["drawElementsInstanced"]=function(mode,count,type,indices,primcount){ext["drawElementsInstancedANGLE"](mode,count,type,indices,primcount)};return 1}}function __webgl_enable_OES_vertex_array_object(ctx){var ext=ctx.getExtension("OES_vertex_array_object");if(ext){ctx["createVertexArray"]=function(){return ext["createVertexArrayOES"]()};ctx["deleteVertexArray"]=function(vao){ext["deleteVertexArrayOES"](vao)};ctx["bindVertexArray"]=function(vao){ext["bindVertexArrayOES"](vao)};ctx["isVertexArray"]=function(vao){return ext["isVertexArrayOES"](vao)};return 1}}function __webgl_enable_WEBGL_draw_buffers(ctx){var ext=ctx.getExtension("WEBGL_draw_buffers");if(ext){ctx["drawBuffers"]=function(n,bufs){ext["drawBuffersWEBGL"](n,bufs)};return 1}}function __webgl_enable_WEBGL_multi_draw(ctx){return!!(ctx.multiDrawWebgl=ctx.getExtension("WEBGL_multi_draw"))}var GL={counter:1,buffers:[],programs:[],framebuffers:[],renderbuffers:[],textures:[],shaders:[],vaos:[],contexts:[],offscreenCanvases:{},queries:[],stringCache:{},unpackAlignment:4,recordError:function recordError(errorCode){if(!GL.lastError){GL.lastError=errorCode}},getNewId:function(table){var ret=GL.counter++;for(var i=table.length;i<ret;i++){table[i]=null}return ret},getSource:function(shader,count,string,length){var source="";for(var i=0;i<count;++i){var len=length?HEAP32[length+i*4>>>2]:-1;source+=UTF8ToString(HEAP32[string+i*4>>>2],len<0?undefined:len)}return source},createContext:function(canvas,webGLContextAttributes){if(!canvas.getContextSafariWebGL2Fixed){canvas.getContextSafariWebGL2Fixed=canvas.getContext;function fixedGetContext(ver,attrs){var gl=canvas.getContextSafariWebGL2Fixed(ver,attrs);return ver=="webgl"==gl instanceof WebGLRenderingContext?gl:null}canvas.getContext=fixedGetContext}var ctx=canvas.getContext("webgl",webGLContextAttributes);if(!ctx)return 0;var handle=GL.registerContext(ctx,webGLContextAttributes);return handle},registerContext:function(ctx,webGLContextAttributes){var handle=GL.getNewId(GL.contexts);var context={handle:handle,attributes:webGLContextAttributes,version:webGLContextAttributes.majorVersion,GLctx:ctx};if(ctx.canvas)ctx.canvas.GLctxObject=context;GL.contexts[handle]=context;if(typeof webGLContextAttributes.enableExtensionsByDefault=="undefined"||webGLContextAttributes.enableExtensionsByDefault){GL.initExtensions(context)}return handle},makeContextCurrent:function(contextHandle){GL.currentContext=GL.contexts[contextHandle];Module.ctx=GLctx=GL.currentContext&&GL.currentContext.GLctx;return!(contextHandle&&!GLctx)},getContext:function(contextHandle){return GL.contexts[contextHandle]},deleteContext:function(contextHandle){if(GL.currentContext===GL.contexts[contextHandle])GL.currentContext=null;if(typeof JSEvents=="object")JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas);if(GL.contexts[contextHandle]&&GL.contexts[contextHandle].GLctx.canvas)GL.contexts[contextHandle].GLctx.canvas.GLctxObject=undefined;GL.contexts[contextHandle]=null},initExtensions:function(context){if(!context)context=GL.currentContext;if(context.initExtensionsDone)return;context.initExtensionsDone=true;var GLctx=context.GLctx;__webgl_enable_ANGLE_instanced_arrays(GLctx);__webgl_enable_OES_vertex_array_object(GLctx);__webgl_enable_WEBGL_draw_buffers(GLctx);{GLctx.disjointTimerQueryExt=GLctx.getExtension("EXT_disjoint_timer_query")}__webgl_enable_WEBGL_multi_draw(GLctx);var exts=GLctx.getSupportedExtensions()||[];exts.forEach(function(ext){if(!ext.includes("lose_context")&&!ext.includes("debug")){GLctx.getExtension(ext)}})}};function _eglCreateContext(display,config,hmm,contextAttribs){if(display!=62e3){EGL.setErrorCode(12296);return 0}var glesContextVersion=1;for(;;){var param=HEAP32[contextAttribs>>>2];if(param==12440){glesContextVersion=HEAP32[contextAttribs+4>>>2]}else if(param==12344){break}else{EGL.setErrorCode(12292);return 0}contextAttribs+=8}if(glesContextVersion!=2){EGL.setErrorCode(12293);return 0}EGL.contextAttributes.majorVersion=glesContextVersion-1;EGL.contextAttributes.minorVersion=0;EGL.context=GL.createContext(Module["canvas"],EGL.contextAttributes);if(EGL.context!=0){EGL.setErrorCode(12288);GL.makeContextCurrent(EGL.context);Module.useWebGL=true;Browser.moduleContextCreatedCallbacks.forEach(function(callback){callback()});GL.makeContextCurrent(null);return 62004}else{EGL.setErrorCode(12297);return 0}}function _eglCreateWindowSurface(display,config,win,attrib_list){if(display!=62e3){EGL.setErrorCode(12296);return 0}if(config!=62002){EGL.setErrorCode(12293);return 0}EGL.setErrorCode(12288);return 62006}function _eglDestroyContext(display,context){if(display!=62e3){EGL.setErrorCode(12296);return 0}if(context!=62004){EGL.setErrorCode(12294);return 0}GL.deleteContext(EGL.context);EGL.setErrorCode(12288);if(EGL.currentContext==context){EGL.currentContext=0}return 1}function _eglDestroySurface(display,surface){if(display!=62e3){EGL.setErrorCode(12296);return 0}if(surface!=62006){EGL.setErrorCode(12301);return 1}if(EGL.currentReadSurface==surface){EGL.currentReadSurface=0}if(EGL.currentDrawSurface==surface){EGL.currentDrawSurface=0}EGL.setErrorCode(12288);return 1}function _eglGetCurrentContext(){return EGL.currentContext}function _eglGetCurrentDisplay(){return EGL.currentContext?62e3:0}function _eglGetCurrentSurface(readdraw){if(readdraw==12378){return EGL.currentReadSurface}else if(readdraw==12377){return EGL.currentDrawSurface}else{EGL.setErrorCode(12300);return 0}}function _eglGetDisplay(nativeDisplayType){EGL.setErrorCode(12288);return 62e3}function _eglGetError(){return EGL.errorCode}function _eglInitialize(display,majorVersion,minorVersion){if(display==62e3){if(majorVersion){HEAP32[majorVersion>>>2]=1}if(minorVersion){HEAP32[minorVersion>>>2]=4}EGL.defaultDisplayInitialized=true;EGL.setErrorCode(12288);return 1}else{EGL.setErrorCode(12296);return 0}}function _eglMakeCurrent(display,draw,read,context){if(display!=62e3){EGL.setErrorCode(12296);return 0}if(context!=0&&context!=62004){EGL.setErrorCode(12294);return 0}if(read!=0&&read!=62006||draw!=0&&draw!=62006){EGL.setErrorCode(12301);return 0}GL.makeContextCurrent(context?EGL.context:null);EGL.currentContext=context;EGL.currentDrawSurface=draw;EGL.currentReadSurface=read;EGL.setErrorCode(12288);return 1}function _eglQueryString(display,name){if(display!=62e3){EGL.setErrorCode(12296);return 0}EGL.setErrorCode(12288);if(EGL.stringCache[name])return EGL.stringCache[name];var ret;switch(name){case 12371:ret=allocateUTF8("Emscripten");break;case 12372:ret=allocateUTF8("1.4 Emscripten EGL");break;case 12373:ret=allocateUTF8("");break;case 12429:ret=allocateUTF8("OpenGL_ES");break;default:EGL.setErrorCode(12300);return 0}EGL.stringCache[name]=ret;return ret}function _eglQuerySurface(display,surface,attribute,value){if(display!=62e3){EGL.setErrorCode(12296);return 0}if(surface!=62006){EGL.setErrorCode(12301);return 0}if(!value){EGL.setErrorCode(12300);return 0}EGL.setErrorCode(12288);switch(attribute){case 12328:HEAP32[value>>>2]=62002;return 1;case 12376:return 1;case 12375:HEAP32[value>>>2]=Module["canvas"].width;return 1;case 12374:HEAP32[value>>>2]=Module["canvas"].height;return 1;case 12432:HEAP32[value>>>2]=-1;return 1;case 12433:HEAP32[value>>>2]=-1;return 1;case 12434:HEAP32[value>>>2]=-1;return 1;case 12422:HEAP32[value>>>2]=12420;return 1;case 12441:HEAP32[value>>>2]=12442;return 1;case 12435:HEAP32[value>>>2]=12437;return 1;case 12416:case 12417:case 12418:case 12419:return 1;default:EGL.setErrorCode(12292);return 0}}function _eglSwapBuffers(){if(!EGL.defaultDisplayInitialized){EGL.setErrorCode(12289)}else if(!Module.ctx){EGL.setErrorCode(12290)}else if(Module.ctx.isContextLost()){EGL.setErrorCode(12302)}else{EGL.setErrorCode(12288);return 1}return 0}function _eglSwapInterval(display,interval){if(display!=62e3){EGL.setErrorCode(12296);return 0}if(interval==0)_emscripten_set_main_loop_timing(0,0);else _emscripten_set_main_loop_timing(1,interval);EGL.setErrorCode(12288);return 1}function _eglTerminate(display){if(display!=62e3){EGL.setErrorCode(12296);return 0}EGL.currentContext=0;EGL.currentReadSurface=0;EGL.currentDrawSurface=0;EGL.defaultDisplayInitialized=false;EGL.setErrorCode(12288);return 1}var readAsmConstArgsArray=[];function readAsmConstArgs(sigPtr,buf){readAsmConstArgsArray.length=0;var ch;buf>>=2;while(ch=HEAPU8[sigPtr++>>>0]){buf+=ch!=105&buf;readAsmConstArgsArray.push(ch==105?HEAP32[buf>>>0]:HEAPF64[buf++>>>1]);++buf}return readAsmConstArgsArray}function _emscripten_asm_const_int(code,sigPtr,argbuf){var args=readAsmConstArgs(sigPtr,argbuf);return ASM_CONSTS[code].apply(null,args)}function traverseStack(args){if(!args||!args.callee||!args.callee.name){return[null,"",""]}var funstr=args.callee.toString();var funcname=args.callee.name;var str="(";var first=true;for(var i in args){var a=args[i];if(!first){str+=", "}first=false;if(typeof a=="number"||typeof a=="string"){str+=a}else{str+="("+typeof a+")"}}str+=")";var caller=args.callee.caller;args=caller?caller.arguments:[];if(first)str="";return[args,funcname,str]}function _emscripten_get_callstack_js(flags){var callstack=jsStackTrace();var iThisFunc=callstack.lastIndexOf("_emscripten_log");var iThisFunc2=callstack.lastIndexOf("_emscripten_get_callstack");var iNextLine=callstack.indexOf("\n",Math.max(iThisFunc,iThisFunc2))+1;callstack=callstack.slice(iNextLine);if(flags&32){warnOnce("EM_LOG_DEMANGLE is deprecated; ignoring")}if(flags&8&&typeof emscripten_source_map=="undefined"){warnOnce('Source map information is not available, emscripten_log with EM_LOG_C_STACK will be ignored. Build with "--pre-js $EMSCRIPTEN/src/emscripten-source-map.min.js" linker flag to add source map loading to code.');flags^=8;flags|=16}var stack_args=null;if(flags&128){stack_args=traverseStack(arguments);while(stack_args[1].includes("_emscripten_"))stack_args=traverseStack(stack_args[0])}var lines=callstack.split("\n");callstack="";var newFirefoxRe=new RegExp("\\s*(.*?)@(.*?):([0-9]+):([0-9]+)");var firefoxRe=new RegExp("\\s*(.*?)@(.*):(.*)(:(.*))?");var chromeRe=new RegExp("\\s*at (.*?) \\((.*):(.*):(.*)\\)");for(var l in lines){var line=lines[l];var symbolName="";var file="";var lineno=0;var column=0;var parts=chromeRe.exec(line);if(parts&&parts.length==5){symbolName=parts[1];file=parts[2];lineno=parts[3];column=parts[4]}else{parts=newFirefoxRe.exec(line);if(!parts)parts=firefoxRe.exec(line);if(parts&&parts.length>=4){symbolName=parts[1];file=parts[2];lineno=parts[3];column=parts[4]|0}else{callstack+=line+"\n";continue}}var haveSourceMap=false;if(flags&8){var orig=emscripten_source_map.originalPositionFor({line:lineno,column:column});haveSourceMap=orig&&orig.source;if(haveSourceMap){if(flags&64){orig.source=orig.source.substring(orig.source.replace(/\\/g,"/").lastIndexOf("/")+1)}callstack+="    at "+symbolName+" ("+orig.source+":"+orig.line+":"+orig.column+")\n"}}if(flags&16||!haveSourceMap){if(flags&64){file=file.substring(file.replace(/\\/g,"/").lastIndexOf("/")+1)}callstack+=(haveSourceMap?"     = "+symbolName:"    at "+symbolName)+" ("+file+":"+lineno+":"+column+")\n"}if(flags&128&&stack_args[0]){if(stack_args[1]==symbolName&&stack_args[2].length>0){callstack=callstack.replace(/\s+$/,"");callstack+=" with values: "+stack_args[1]+stack_args[2]+"\n"}stack_args=traverseStack(stack_args[0])}}callstack=callstack.replace(/\s+$/,"");return callstack}function _emscripten_get_callstack(flags,str,maxbytes){var callstack=_emscripten_get_callstack_js(flags);if(!str||maxbytes<=0){return lengthBytesUTF8(callstack)+1}var bytesWrittenExcludingNull=stringToUTF8(callstack,str,maxbytes);return bytesWrittenExcludingNull+1}var JSEvents={inEventHandler:0,removeAllEventListeners:function(){for(var i=JSEvents.eventHandlers.length-1;i>=0;--i){JSEvents._removeHandler(i)}JSEvents.eventHandlers=[];JSEvents.deferredCalls=[]},registerRemoveEventListeners:function(){if(!JSEvents.removeEventListenersRegistered){__ATEXIT__.push(JSEvents.removeAllEventListeners);JSEvents.removeEventListenersRegistered=true}},deferredCalls:[],deferCall:function(targetFunction,precedence,argsList){function arraysHaveEqualContent(arrA,arrB){if(arrA.length!=arrB.length)return false;for(var i in arrA){if(arrA[i]!=arrB[i])return false}return true}for(var i in JSEvents.deferredCalls){var call=JSEvents.deferredCalls[i];if(call.targetFunction==targetFunction&&arraysHaveEqualContent(call.argsList,argsList)){return}}JSEvents.deferredCalls.push({targetFunction:targetFunction,precedence:precedence,argsList:argsList});JSEvents.deferredCalls.sort(function(x,y){return x.precedence<y.precedence})},removeDeferredCalls:function(targetFunction){for(var i=0;i<JSEvents.deferredCalls.length;++i){if(JSEvents.deferredCalls[i].targetFunction==targetFunction){JSEvents.deferredCalls.splice(i,1);--i}}},canPerformEventHandlerRequests:function(){return JSEvents.inEventHandler&&JSEvents.currentEventHandler.allowsDeferredCalls},runDeferredCalls:function(){if(!JSEvents.canPerformEventHandlerRequests()){return}for(var i=0;i<JSEvents.deferredCalls.length;++i){var call=JSEvents.deferredCalls[i];JSEvents.deferredCalls.splice(i,1);--i;call.targetFunction.apply(null,call.argsList)}},eventHandlers:[],removeAllHandlersOnTarget:function(target,eventTypeString){for(var i=0;i<JSEvents.eventHandlers.length;++i){if(JSEvents.eventHandlers[i].target==target&&(!eventTypeString||eventTypeString==JSEvents.eventHandlers[i].eventTypeString)){JSEvents._removeHandler(i--)}}},_removeHandler:function(i){var h=JSEvents.eventHandlers[i];h.target.removeEventListener(h.eventTypeString,h.eventListenerFunc,h.useCapture);JSEvents.eventHandlers.splice(i,1)},registerOrRemoveHandler:function(eventHandler){var jsEventHandler=function jsEventHandler(event){++JSEvents.inEventHandler;JSEvents.currentEventHandler=eventHandler;JSEvents.runDeferredCalls();eventHandler.handlerFunc(event);JSEvents.runDeferredCalls();--JSEvents.inEventHandler};if(eventHandler.callbackfunc){eventHandler.eventListenerFunc=jsEventHandler;eventHandler.target.addEventListener(eventHandler.eventTypeString,jsEventHandler,eventHandler.useCapture);JSEvents.eventHandlers.push(eventHandler);JSEvents.registerRemoveEventListeners()}else{for(var i=0;i<JSEvents.eventHandlers.length;++i){if(JSEvents.eventHandlers[i].target==eventHandler.target&&JSEvents.eventHandlers[i].eventTypeString==eventHandler.eventTypeString){JSEvents._removeHandler(i--)}}}},getNodeNameForTarget:function(target){if(!target)return"";if(target==window)return"#window";if(target==screen)return"#screen";return target&&target.nodeName?target.nodeName:""},fullscreenEnabled:function(){return document.fullscreenEnabled||document.webkitFullscreenEnabled}};function maybeCStringToJsString(cString){return cString>2?UTF8ToString(cString):cString}var specialHTMLTargets=[0,typeof document!="undefined"?document:0,typeof window!="undefined"?window:0];function findEventTarget(target){target=maybeCStringToJsString(target);var domElement=specialHTMLTargets[target]||(typeof document!="undefined"?document.querySelector(target):undefined);return domElement}function findCanvasEventTarget(target){return findEventTarget(target)}function _emscripten_get_canvas_element_size(target,width,height){var canvas=findCanvasEventTarget(target);if(!canvas)return-4;HEAP32[width>>>2]=canvas.width;HEAP32[height>>>2]=canvas.height}function _emscripten_get_device_pixel_ratio(){return typeof devicePixelRatio=="number"&&devicePixelRatio||1}function getBoundingClientRect(e){return specialHTMLTargets.indexOf(e)<0?e.getBoundingClientRect():{"left":0,"top":0}}function _emscripten_get_element_css_size(target,width,height){target=findEventTarget(target);if(!target)return-4;var rect=getBoundingClientRect(target);HEAPF64[width>>>3]=rect.width;HEAPF64[height>>>3]=rect.height;return 0}function getHeapMax(){return 4294901760}function _emscripten_get_heap_max(){return getHeapMax()}function _emscripten_get_preloaded_image_data(path,w,h){if((path|0)===path)path=UTF8ToString(path);path=PATH_FS.resolve(path);var canvas=preloadedImages[path];if(canvas){var ctx=canvas.getContext("2d");var image=ctx.getImageData(0,0,canvas.width,canvas.height);var buf=_malloc(canvas.width*canvas.height*4);HEAPU8.set(image.data,buf>>>0);HEAP32[w>>>2]=canvas.width;HEAP32[h>>>2]=canvas.height;return buf}return 0}function _emscripten_glActiveTexture(x0){GLctx["activeTexture"](x0)}function _emscripten_glAttachShader(program,shader){GLctx.attachShader(GL.programs[program],GL.shaders[shader])}function _emscripten_glBeginQueryEXT(target,id){GLctx.disjointTimerQueryExt["beginQueryEXT"](target,GL.queries[id])}function _emscripten_glBindAttribLocation(program,index,name){GLctx.bindAttribLocation(GL.programs[program],index,UTF8ToString(name))}function _emscripten_glBindBuffer(target,buffer){GLctx.bindBuffer(target,GL.buffers[buffer])}function _emscripten_glBindFramebuffer(target,framebuffer){GLctx.bindFramebuffer(target,GL.framebuffers[framebuffer])}function _emscripten_glBindRenderbuffer(target,renderbuffer){GLctx.bindRenderbuffer(target,GL.renderbuffers[renderbuffer])}function _emscripten_glBindTexture(target,texture){GLctx.bindTexture(target,GL.textures[texture])}function _emscripten_glBindVertexArrayOES(vao){GLctx["bindVertexArray"](GL.vaos[vao])}function _emscripten_glBlendColor(x0,x1,x2,x3){GLctx["blendColor"](x0,x1,x2,x3)}function _emscripten_glBlendEquation(x0){GLctx["blendEquation"](x0)}function _emscripten_glBlendEquationSeparate(x0,x1){GLctx["blendEquationSeparate"](x0,x1)}function _emscripten_glBlendFunc(x0,x1){GLctx["blendFunc"](x0,x1)}function _emscripten_glBlendFuncSeparate(x0,x1,x2,x3){GLctx["blendFuncSeparate"](x0,x1,x2,x3)}function _emscripten_glBufferData(target,size,data,usage){GLctx.bufferData(target,data?HEAPU8.subarray(data>>>0,data+size>>>0):size,usage)}function _emscripten_glBufferSubData(target,offset,size,data){GLctx.bufferSubData(target,offset,HEAPU8.subarray(data>>>0,data+size>>>0))}function _emscripten_glCheckFramebufferStatus(x0){return GLctx["checkFramebufferStatus"](x0)}function _emscripten_glClear(x0){GLctx["clear"](x0)}function _emscripten_glClearColor(x0,x1,x2,x3){GLctx["clearColor"](x0,x1,x2,x3)}function _emscripten_glClearDepthf(x0){GLctx["clearDepth"](x0)}function _emscripten_glClearStencil(x0){GLctx["clearStencil"](x0)}function _emscripten_glColorMask(red,green,blue,alpha){GLctx.colorMask(!!red,!!green,!!blue,!!alpha)}function _emscripten_glCompileShader(shader){GLctx.compileShader(GL.shaders[shader])}function _emscripten_glCompressedTexImage2D(target,level,internalFormat,width,height,border,imageSize,data){GLctx["compressedTexImage2D"](target,level,internalFormat,width,height,border,data?HEAPU8.subarray(data>>>0,data+imageSize>>>0):null)}function _emscripten_glCompressedTexSubImage2D(target,level,xoffset,yoffset,width,height,format,imageSize,data){GLctx["compressedTexSubImage2D"](target,level,xoffset,yoffset,width,height,format,data?HEAPU8.subarray(data>>>0,data+imageSize>>>0):null)}function _emscripten_glCopyTexImage2D(x0,x1,x2,x3,x4,x5,x6,x7){GLctx["copyTexImage2D"](x0,x1,x2,x3,x4,x5,x6,x7)}function _emscripten_glCopyTexSubImage2D(x0,x1,x2,x3,x4,x5,x6,x7){GLctx["copyTexSubImage2D"](x0,x1,x2,x3,x4,x5,x6,x7)}function _emscripten_glCreateProgram(){var id=GL.getNewId(GL.programs);var program=GLctx.createProgram();program.name=id;program.maxUniformLength=program.maxAttributeLength=program.maxUniformBlockNameLength=0;program.uniformIdCounter=1;GL.programs[id]=program;return id}function _emscripten_glCreateShader(shaderType){var id=GL.getNewId(GL.shaders);GL.shaders[id]=GLctx.createShader(shaderType);return id}function _emscripten_glCullFace(x0){GLctx["cullFace"](x0)}function _emscripten_glDeleteBuffers(n,buffers){for(var i=0;i<n;i++){var id=HEAP32[buffers+i*4>>>2];var buffer=GL.buffers[id];if(!buffer)continue;GLctx.deleteBuffer(buffer);buffer.name=0;GL.buffers[id]=null}}function _emscripten_glDeleteFramebuffers(n,framebuffers){for(var i=0;i<n;++i){var id=HEAP32[framebuffers+i*4>>>2];var framebuffer=GL.framebuffers[id];if(!framebuffer)continue;GLctx.deleteFramebuffer(framebuffer);framebuffer.name=0;GL.framebuffers[id]=null}}function _emscripten_glDeleteProgram(id){if(!id)return;var program=GL.programs[id];if(!program){GL.recordError(1281);return}GLctx.deleteProgram(program);program.name=0;GL.programs[id]=null}function _emscripten_glDeleteQueriesEXT(n,ids){for(var i=0;i<n;i++){var id=HEAP32[ids+i*4>>>2];var query=GL.queries[id];if(!query)continue;GLctx.disjointTimerQueryExt["deleteQueryEXT"](query);GL.queries[id]=null}}function _emscripten_glDeleteRenderbuffers(n,renderbuffers){for(var i=0;i<n;i++){var id=HEAP32[renderbuffers+i*4>>>2];var renderbuffer=GL.renderbuffers[id];if(!renderbuffer)continue;GLctx.deleteRenderbuffer(renderbuffer);renderbuffer.name=0;GL.renderbuffers[id]=null}}function _emscripten_glDeleteShader(id){if(!id)return;var shader=GL.shaders[id];if(!shader){GL.recordError(1281);return}GLctx.deleteShader(shader);GL.shaders[id]=null}function _emscripten_glDeleteTextures(n,textures){for(var i=0;i<n;i++){var id=HEAP32[textures+i*4>>>2];var texture=GL.textures[id];if(!texture)continue;GLctx.deleteTexture(texture);texture.name=0;GL.textures[id]=null}}function _emscripten_glDeleteVertexArraysOES(n,vaos){for(var i=0;i<n;i++){var id=HEAP32[vaos+i*4>>>2];GLctx["deleteVertexArray"](GL.vaos[id]);GL.vaos[id]=null}}function _emscripten_glDepthFunc(x0){GLctx["depthFunc"](x0)}function _emscripten_glDepthMask(flag){GLctx.depthMask(!!flag)}function _emscripten_glDepthRangef(x0,x1){GLctx["depthRange"](x0,x1)}function _emscripten_glDetachShader(program,shader){GLctx.detachShader(GL.programs[program],GL.shaders[shader])}function _emscripten_glDisable(x0){GLctx["disable"](x0)}function _emscripten_glDisableVertexAttribArray(index){GLctx.disableVertexAttribArray(index)}function _emscripten_glDrawArrays(mode,first,count){GLctx.drawArrays(mode,first,count)}function _emscripten_glDrawArraysInstancedANGLE(mode,first,count,primcount){GLctx["drawArraysInstanced"](mode,first,count,primcount)}var tempFixedLengthArray=[];function _emscripten_glDrawBuffersWEBGL(n,bufs){var bufArray=tempFixedLengthArray[n];for(var i=0;i<n;i++){bufArray[i]=HEAP32[bufs+i*4>>>2]}GLctx["drawBuffers"](bufArray)}function _emscripten_glDrawElements(mode,count,type,indices){GLctx.drawElements(mode,count,type,indices)}function _emscripten_glDrawElementsInstancedANGLE(mode,count,type,indices,primcount){GLctx["drawElementsInstanced"](mode,count,type,indices,primcount)}function _emscripten_glEnable(x0){GLctx["enable"](x0)}function _emscripten_glEnableVertexAttribArray(index){GLctx.enableVertexAttribArray(index)}function _emscripten_glEndQueryEXT(target){GLctx.disjointTimerQueryExt["endQueryEXT"](target)}function _emscripten_glFinish(){GLctx["finish"]()}function _emscripten_glFlush(){GLctx["flush"]()}function _emscripten_glFramebufferRenderbuffer(target,attachment,renderbuffertarget,renderbuffer){GLctx.framebufferRenderbuffer(target,attachment,renderbuffertarget,GL.renderbuffers[renderbuffer])}function _emscripten_glFramebufferTexture2D(target,attachment,textarget,texture,level){GLctx.framebufferTexture2D(target,attachment,textarget,GL.textures[texture],level)}function _emscripten_glFrontFace(x0){GLctx["frontFace"](x0)}function __glGenObject(n,buffers,createFunction,objectTable){for(var i=0;i<n;i++){var buffer=GLctx[createFunction]();var id=buffer&&GL.getNewId(objectTable);if(buffer){buffer.name=id;objectTable[id]=buffer}else{GL.recordError(1282)}HEAP32[buffers+i*4>>>2]=id}}function _emscripten_glGenBuffers(n,buffers){__glGenObject(n,buffers,"createBuffer",GL.buffers)}function _emscripten_glGenFramebuffers(n,ids){__glGenObject(n,ids,"createFramebuffer",GL.framebuffers)}function _emscripten_glGenQueriesEXT(n,ids){for(var i=0;i<n;i++){var query=GLctx.disjointTimerQueryExt["createQueryEXT"]();if(!query){GL.recordError(1282);while(i<n)HEAP32[ids+i++*4>>>2]=0;return}var id=GL.getNewId(GL.queries);query.name=id;GL.queries[id]=query;HEAP32[ids+i*4>>>2]=id}}function _emscripten_glGenRenderbuffers(n,renderbuffers){__glGenObject(n,renderbuffers,"createRenderbuffer",GL.renderbuffers)}function _emscripten_glGenTextures(n,textures){__glGenObject(n,textures,"createTexture",GL.textures)}function _emscripten_glGenVertexArraysOES(n,arrays){__glGenObject(n,arrays,"createVertexArray",GL.vaos)}function _emscripten_glGenerateMipmap(x0){GLctx["generateMipmap"](x0)}function __glGetActiveAttribOrUniform(funcName,program,index,bufSize,length,size,type,name){program=GL.programs[program];var info=GLctx[funcName](program,index);if(info){var numBytesWrittenExclNull=name&&stringToUTF8(info.name,name,bufSize);if(length)HEAP32[length>>>2]=numBytesWrittenExclNull;if(size)HEAP32[size>>>2]=info.size;if(type)HEAP32[type>>>2]=info.type}}function _emscripten_glGetActiveAttrib(program,index,bufSize,length,size,type,name){__glGetActiveAttribOrUniform("getActiveAttrib",program,index,bufSize,length,size,type,name)}function _emscripten_glGetActiveUniform(program,index,bufSize,length,size,type,name){__glGetActiveAttribOrUniform("getActiveUniform",program,index,bufSize,length,size,type,name)}function _emscripten_glGetAttachedShaders(program,maxCount,count,shaders){var result=GLctx.getAttachedShaders(GL.programs[program]);var len=result.length;if(len>maxCount){len=maxCount}HEAP32[count>>>2]=len;for(var i=0;i<len;++i){var id=GL.shaders.indexOf(result[i]);HEAP32[shaders+i*4>>>2]=id}}function _emscripten_glGetAttribLocation(program,name){return GLctx.getAttribLocation(GL.programs[program],UTF8ToString(name))}function writeI53ToI64(ptr,num){HEAPU32[ptr>>>2]=num;HEAPU32[ptr+4>>>2]=(num-HEAPU32[ptr>>>2])/4294967296}function emscriptenWebGLGet(name_,p,type){if(!p){GL.recordError(1281);return}var ret=undefined;switch(name_){case 36346:ret=1;break;case 36344:if(type!=0&&type!=1){GL.recordError(1280)}return;case 36345:ret=0;break;case 34466:var formats=GLctx.getParameter(34467);ret=formats?formats.length:0;break}if(ret===undefined){var result=GLctx.getParameter(name_);switch(typeof result){case"number":ret=result;break;case"boolean":ret=result?1:0;break;case"string":GL.recordError(1280);return;case"object":if(result===null){switch(name_){case 34964:case 35725:case 34965:case 36006:case 36007:case 32873:case 34229:case 34068:{ret=0;break}default:{GL.recordError(1280);return}}}else if(result instanceof Float32Array||result instanceof Uint32Array||result instanceof Int32Array||result instanceof Array){for(var i=0;i<result.length;++i){switch(type){case 0:HEAP32[p+i*4>>>2]=result[i];break;case 2:HEAPF32[p+i*4>>>2]=result[i];break;case 4:HEAP8[p+i>>>0]=result[i]?1:0;break}}return}else{try{ret=result.name|0}catch(e){GL.recordError(1280);err("GL_INVALID_ENUM in glGet"+type+"v: Unknown object returned from WebGL getParameter("+name_+")! (error: "+e+")");return}}break;default:GL.recordError(1280);err("GL_INVALID_ENUM in glGet"+type+"v: Native code calling glGet"+type+"v("+name_+") and it returns "+result+" of type "+typeof result+"!");return}}switch(type){case 1:writeI53ToI64(p,ret);break;case 0:HEAP32[p>>>2]=ret;break;case 2:HEAPF32[p>>>2]=ret;break;case 4:HEAP8[p>>>0]=ret?1:0;break}}function _emscripten_glGetBooleanv(name_,p){emscriptenWebGLGet(name_,p,4)}function _emscripten_glGetBufferParameteriv(target,value,data){if(!data){GL.recordError(1281);return}HEAP32[data>>>2]=GLctx.getBufferParameter(target,value)}function _emscripten_glGetError(){var error=GLctx.getError()||GL.lastError;GL.lastError=0;return error}function _emscripten_glGetFloatv(name_,p){emscriptenWebGLGet(name_,p,2)}function _emscripten_glGetFramebufferAttachmentParameteriv(target,attachment,pname,params){var result=GLctx.getFramebufferAttachmentParameter(target,attachment,pname);if(result instanceof WebGLRenderbuffer||result instanceof WebGLTexture){result=result.name|0}HEAP32[params>>>2]=result}function _emscripten_glGetIntegerv(name_,p){emscriptenWebGLGet(name_,p,0)}function _emscripten_glGetProgramInfoLog(program,maxLength,length,infoLog){var log=GLctx.getProgramInfoLog(GL.programs[program]);if(log===null)log="(unknown error)";var numBytesWrittenExclNull=maxLength>0&&infoLog?stringToUTF8(log,infoLog,maxLength):0;if(length)HEAP32[length>>>2]=numBytesWrittenExclNull}function _emscripten_glGetProgramiv(program,pname,p){if(!p){GL.recordError(1281);return}if(program>=GL.counter){GL.recordError(1281);return}program=GL.programs[program];if(pname==35716){var log=GLctx.getProgramInfoLog(program);if(log===null)log="(unknown error)";HEAP32[p>>>2]=log.length+1}else if(pname==35719){if(!program.maxUniformLength){for(var i=0;i<GLctx.getProgramParameter(program,35718);++i){program.maxUniformLength=Math.max(program.maxUniformLength,GLctx.getActiveUniform(program,i).name.length+1)}}HEAP32[p>>>2]=program.maxUniformLength}else if(pname==35722){if(!program.maxAttributeLength){for(var i=0;i<GLctx.getProgramParameter(program,35721);++i){program.maxAttributeLength=Math.max(program.maxAttributeLength,GLctx.getActiveAttrib(program,i).name.length+1)}}HEAP32[p>>>2]=program.maxAttributeLength}else if(pname==35381){if(!program.maxUniformBlockNameLength){for(var i=0;i<GLctx.getProgramParameter(program,35382);++i){program.maxUniformBlockNameLength=Math.max(program.maxUniformBlockNameLength,GLctx.getActiveUniformBlockName(program,i).length+1)}}HEAP32[p>>>2]=program.maxUniformBlockNameLength}else{HEAP32[p>>>2]=GLctx.getProgramParameter(program,pname)}}function _emscripten_glGetQueryObjecti64vEXT(id,pname,params){if(!params){GL.recordError(1281);return}var query=GL.queries[id];var param;{param=GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query,pname)}var ret;if(typeof param=="boolean"){ret=param?1:0}else{ret=param}writeI53ToI64(params,ret)}function _emscripten_glGetQueryObjectivEXT(id,pname,params){if(!params){GL.recordError(1281);return}var query=GL.queries[id];var param=GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query,pname);var ret;if(typeof param=="boolean"){ret=param?1:0}else{ret=param}HEAP32[params>>>2]=ret}function _emscripten_glGetQueryObjectui64vEXT(id,pname,params){if(!params){GL.recordError(1281);return}var query=GL.queries[id];var param;{param=GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query,pname)}var ret;if(typeof param=="boolean"){ret=param?1:0}else{ret=param}writeI53ToI64(params,ret)}function _emscripten_glGetQueryObjectuivEXT(id,pname,params){if(!params){GL.recordError(1281);return}var query=GL.queries[id];var param=GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query,pname);var ret;if(typeof param=="boolean"){ret=param?1:0}else{ret=param}HEAP32[params>>>2]=ret}function _emscripten_glGetQueryivEXT(target,pname,params){if(!params){GL.recordError(1281);return}HEAP32[params>>>2]=GLctx.disjointTimerQueryExt["getQueryEXT"](target,pname)}function _emscripten_glGetRenderbufferParameteriv(target,pname,params){if(!params){GL.recordError(1281);return}HEAP32[params>>>2]=GLctx.getRenderbufferParameter(target,pname)}function _emscripten_glGetShaderInfoLog(shader,maxLength,length,infoLog){var log=GLctx.getShaderInfoLog(GL.shaders[shader]);if(log===null)log="(unknown error)";var numBytesWrittenExclNull=maxLength>0&&infoLog?stringToUTF8(log,infoLog,maxLength):0;if(length)HEAP32[length>>>2]=numBytesWrittenExclNull}function _emscripten_glGetShaderPrecisionFormat(shaderType,precisionType,range,precision){var result=GLctx.getShaderPrecisionFormat(shaderType,precisionType);HEAP32[range>>>2]=result.rangeMin;HEAP32[range+4>>>2]=result.rangeMax;HEAP32[precision>>>2]=result.precision}function _emscripten_glGetShaderSource(shader,bufSize,length,source){var result=GLctx.getShaderSource(GL.shaders[shader]);if(!result)return;var numBytesWrittenExclNull=bufSize>0&&source?stringToUTF8(result,source,bufSize):0;if(length)HEAP32[length>>>2]=numBytesWrittenExclNull}function _emscripten_glGetShaderiv(shader,pname,p){if(!p){GL.recordError(1281);return}if(pname==35716){var log=GLctx.getShaderInfoLog(GL.shaders[shader]);if(log===null)log="(unknown error)";var logLength=log?log.length+1:0;HEAP32[p>>>2]=logLength}else if(pname==35720){var source=GLctx.getShaderSource(GL.shaders[shader]);var sourceLength=source?source.length+1:0;HEAP32[p>>>2]=sourceLength}else{HEAP32[p>>>2]=GLctx.getShaderParameter(GL.shaders[shader],pname)}}function stringToNewUTF8(jsString){var length=lengthBytesUTF8(jsString)+1;var cString=_malloc(length);stringToUTF8(jsString,cString,length);return cString}function _emscripten_glGetString(name_){var ret=GL.stringCache[name_];if(!ret){switch(name_){case 7939:var exts=GLctx.getSupportedExtensions()||[];exts=exts.concat(exts.map(function(e){return"GL_"+e}));ret=stringToNewUTF8(exts.join(" "));break;case 7936:case 7937:case 37445:case 37446:var s=GLctx.getParameter(name_);if(!s){GL.recordError(1280)}ret=s&&stringToNewUTF8(s);break;case 7938:var glVersion=GLctx.getParameter(7938);{glVersion="OpenGL ES 2.0 ("+glVersion+")"}ret=stringToNewUTF8(glVersion);break;case 35724:var glslVersion=GLctx.getParameter(35724);var ver_re=/^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;var ver_num=glslVersion.match(ver_re);if(ver_num!==null){if(ver_num[1].length==3)ver_num[1]=ver_num[1]+"0";glslVersion="OpenGL ES GLSL ES "+ver_num[1]+" ("+glslVersion+")"}ret=stringToNewUTF8(glslVersion);break;default:GL.recordError(1280)}GL.stringCache[name_]=ret}return ret}function _emscripten_glGetTexParameterfv(target,pname,params){if(!params){GL.recordError(1281);return}HEAPF32[params>>>2]=GLctx.getTexParameter(target,pname)}function _emscripten_glGetTexParameteriv(target,pname,params){if(!params){GL.recordError(1281);return}HEAP32[params>>>2]=GLctx.getTexParameter(target,pname)}function jstoi_q(str){return parseInt(str)}function webglGetLeftBracePos(name){return name.slice(-1)=="]"&&name.lastIndexOf("[")}function webglPrepareUniformLocationsBeforeFirstUse(program){var uniformLocsById=program.uniformLocsById,uniformSizeAndIdsByName=program.uniformSizeAndIdsByName,i,j;if(!uniformLocsById){program.uniformLocsById=uniformLocsById={};program.uniformArrayNamesById={};for(i=0;i<GLctx.getProgramParameter(program,35718);++i){var u=GLctx.getActiveUniform(program,i);var nm=u.name;var sz=u.size;var lb=webglGetLeftBracePos(nm);var arrayName=lb>0?nm.slice(0,lb):nm;var id=program.uniformIdCounter;program.uniformIdCounter+=sz;uniformSizeAndIdsByName[arrayName]=[sz,id];for(j=0;j<sz;++j){uniformLocsById[id]=j;program.uniformArrayNamesById[id++]=arrayName}}}}function _emscripten_glGetUniformLocation(program,name){name=UTF8ToString(name);if(program=GL.programs[program]){webglPrepareUniformLocationsBeforeFirstUse(program);var uniformLocsById=program.uniformLocsById;var arrayIndex=0;var uniformBaseName=name;var leftBrace=webglGetLeftBracePos(name);if(leftBrace>0){arrayIndex=jstoi_q(name.slice(leftBrace+1))>>>0;uniformBaseName=name.slice(0,leftBrace)}var sizeAndId=program.uniformSizeAndIdsByName[uniformBaseName];if(sizeAndId&&arrayIndex<sizeAndId[0]){arrayIndex+=sizeAndId[1];if(uniformLocsById[arrayIndex]=uniformLocsById[arrayIndex]||GLctx.getUniformLocation(program,name)){return arrayIndex}}}else{GL.recordError(1281)}return-1}function webglGetUniformLocation(location){var p=GLctx.currentProgram;if(p){var webglLoc=p.uniformLocsById[location];if(typeof webglLoc=="number"){p.uniformLocsById[location]=webglLoc=GLctx.getUniformLocation(p,p.uniformArrayNamesById[location]+(webglLoc>0?"["+webglLoc+"]":""))}return webglLoc}else{GL.recordError(1282)}}function emscriptenWebGLGetUniform(program,location,params,type){if(!params){GL.recordError(1281);return}program=GL.programs[program];webglPrepareUniformLocationsBeforeFirstUse(program);var data=GLctx.getUniform(program,webglGetUniformLocation(location));if(typeof data=="number"||typeof data=="boolean"){switch(type){case 0:HEAP32[params>>>2]=data;break;case 2:HEAPF32[params>>>2]=data;break}}else{for(var i=0;i<data.length;i++){switch(type){case 0:HEAP32[params+i*4>>>2]=data[i];break;case 2:HEAPF32[params+i*4>>>2]=data[i];break}}}}function _emscripten_glGetUniformfv(program,location,params){emscriptenWebGLGetUniform(program,location,params,2)}function _emscripten_glGetUniformiv(program,location,params){emscriptenWebGLGetUniform(program,location,params,0)}function _emscripten_glGetVertexAttribPointerv(index,pname,pointer){if(!pointer){GL.recordError(1281);return}HEAP32[pointer>>>2]=GLctx.getVertexAttribOffset(index,pname)}function emscriptenWebGLGetVertexAttrib(index,pname,params,type){if(!params){GL.recordError(1281);return}var data=GLctx.getVertexAttrib(index,pname);if(pname==34975){HEAP32[params>>>2]=data&&data["name"]}else if(typeof data=="number"||typeof data=="boolean"){switch(type){case 0:HEAP32[params>>>2]=data;break;case 2:HEAPF32[params>>>2]=data;break;case 5:HEAP32[params>>>2]=Math.fround(data);break}}else{for(var i=0;i<data.length;i++){switch(type){case 0:HEAP32[params+i*4>>>2]=data[i];break;case 2:HEAPF32[params+i*4>>>2]=data[i];break;case 5:HEAP32[params+i*4>>>2]=Math.fround(data[i]);break}}}}function _emscripten_glGetVertexAttribfv(index,pname,params){emscriptenWebGLGetVertexAttrib(index,pname,params,2)}function _emscripten_glGetVertexAttribiv(index,pname,params){emscriptenWebGLGetVertexAttrib(index,pname,params,5)}function _emscripten_glHint(x0,x1){GLctx["hint"](x0,x1)}function _emscripten_glIsBuffer(buffer){var b=GL.buffers[buffer];if(!b)return 0;return GLctx.isBuffer(b)}function _emscripten_glIsEnabled(x0){return GLctx["isEnabled"](x0)}function _emscripten_glIsFramebuffer(framebuffer){var fb=GL.framebuffers[framebuffer];if(!fb)return 0;return GLctx.isFramebuffer(fb)}function _emscripten_glIsProgram(program){program=GL.programs[program];if(!program)return 0;return GLctx.isProgram(program)}function _emscripten_glIsQueryEXT(id){var query=GL.queries[id];if(!query)return 0;return GLctx.disjointTimerQueryExt["isQueryEXT"](query)}function _emscripten_glIsRenderbuffer(renderbuffer){var rb=GL.renderbuffers[renderbuffer];if(!rb)return 0;return GLctx.isRenderbuffer(rb)}function _emscripten_glIsShader(shader){var s=GL.shaders[shader];if(!s)return 0;return GLctx.isShader(s)}function _emscripten_glIsTexture(id){var texture=GL.textures[id];if(!texture)return 0;return GLctx.isTexture(texture)}function _emscripten_glIsVertexArrayOES(array){var vao=GL.vaos[array];if(!vao)return 0;return GLctx["isVertexArray"](vao)}function _emscripten_glLineWidth(x0){GLctx["lineWidth"](x0)}function _emscripten_glLinkProgram(program){program=GL.programs[program];GLctx.linkProgram(program);program.uniformLocsById=0;program.uniformSizeAndIdsByName={}}function _emscripten_glPixelStorei(pname,param){if(pname==3317){GL.unpackAlignment=param}GLctx.pixelStorei(pname,param)}function _emscripten_glPolygonOffset(x0,x1){GLctx["polygonOffset"](x0,x1)}function _emscripten_glQueryCounterEXT(id,target){GLctx.disjointTimerQueryExt["queryCounterEXT"](GL.queries[id],target)}function computeUnpackAlignedImageSize(width,height,sizePerPixel,alignment){function roundedToNextMultipleOf(x,y){return x+y-1&-y}var plainRowSize=width*sizePerPixel;var alignedRowSize=roundedToNextMultipleOf(plainRowSize,alignment);return height*alignedRowSize}function __colorChannelsInGlTextureFormat(format){var colorChannels={5:3,6:4,8:2,29502:3,29504:4};return colorChannels[format-6402]||1}function heapObjectForWebGLType(type){type-=5120;if(type==1)return HEAPU8;if(type==4)return HEAP32;if(type==6)return HEAPF32;if(type==5||type==28922)return HEAPU32;return HEAPU16}function heapAccessShiftForWebGLHeap(heap){return 31-Math.clz32(heap.BYTES_PER_ELEMENT)}function emscriptenWebGLGetTexPixelData(type,format,width,height,pixels,internalFormat){var heap=heapObjectForWebGLType(type);var shift=heapAccessShiftForWebGLHeap(heap);var byteSize=1<<shift;var sizePerPixel=__colorChannelsInGlTextureFormat(format)*byteSize;var bytes=computeUnpackAlignedImageSize(width,height,sizePerPixel,GL.unpackAlignment);return heap.subarray(pixels>>>shift,pixels+bytes>>>shift)}function _emscripten_glReadPixels(x,y,width,height,format,type,pixels){var pixelData=emscriptenWebGLGetTexPixelData(type,format,width,height,pixels,format);if(!pixelData){GL.recordError(1280);return}GLctx.readPixels(x,y,width,height,format,type,pixelData)}function _emscripten_glReleaseShaderCompiler(){}function _emscripten_glRenderbufferStorage(x0,x1,x2,x3){GLctx["renderbufferStorage"](x0,x1,x2,x3)}function _emscripten_glSampleCoverage(value,invert){GLctx.sampleCoverage(value,!!invert)}function _emscripten_glScissor(x0,x1,x2,x3){GLctx["scissor"](x0,x1,x2,x3)}function _emscripten_glShaderBinary(){GL.recordError(1280)}function _emscripten_glShaderSource(shader,count,string,length){var source=GL.getSource(shader,count,string,length);GLctx.shaderSource(GL.shaders[shader],source)}function _emscripten_glStencilFunc(x0,x1,x2){GLctx["stencilFunc"](x0,x1,x2)}function _emscripten_glStencilFuncSeparate(x0,x1,x2,x3){GLctx["stencilFuncSeparate"](x0,x1,x2,x3)}function _emscripten_glStencilMask(x0){GLctx["stencilMask"](x0)}function _emscripten_glStencilMaskSeparate(x0,x1){GLctx["stencilMaskSeparate"](x0,x1)}function _emscripten_glStencilOp(x0,x1,x2){GLctx["stencilOp"](x0,x1,x2)}function _emscripten_glStencilOpSeparate(x0,x1,x2,x3){GLctx["stencilOpSeparate"](x0,x1,x2,x3)}function _emscripten_glTexImage2D(target,level,internalFormat,width,height,border,format,type,pixels){GLctx.texImage2D(target,level,internalFormat,width,height,border,format,type,pixels?emscriptenWebGLGetTexPixelData(type,format,width,height,pixels,internalFormat):null)}function _emscripten_glTexParameterf(x0,x1,x2){GLctx["texParameterf"](x0,x1,x2)}function _emscripten_glTexParameterfv(target,pname,params){var param=HEAPF32[params>>>2];GLctx.texParameterf(target,pname,param)}function _emscripten_glTexParameteri(x0,x1,x2){GLctx["texParameteri"](x0,x1,x2)}function _emscripten_glTexParameteriv(target,pname,params){var param=HEAP32[params>>>2];GLctx.texParameteri(target,pname,param)}function _emscripten_glTexSubImage2D(target,level,xoffset,yoffset,width,height,format,type,pixels){var pixelData=null;if(pixels)pixelData=emscriptenWebGLGetTexPixelData(type,format,width,height,pixels,0);GLctx.texSubImage2D(target,level,xoffset,yoffset,width,height,format,type,pixelData)}function _emscripten_glUniform1f(location,v0){GLctx.uniform1f(webglGetUniformLocation(location),v0)}var miniTempWebGLFloatBuffers=[];function _emscripten_glUniform1fv(location,count,value){if(count<=288){var view=miniTempWebGLFloatBuffers[count-1];for(var i=0;i<count;++i){view[i]=HEAPF32[value+4*i>>>2]}}else{var view=HEAPF32.subarray(value>>>2,value+count*4>>>2)}GLctx.uniform1fv(webglGetUniformLocation(location),view)}function _emscripten_glUniform1i(location,v0){GLctx.uniform1i(webglGetUniformLocation(location),v0)}var __miniTempWebGLIntBuffers=[];function _emscripten_glUniform1iv(location,count,value){if(count<=288){var view=__miniTempWebGLIntBuffers[count-1];for(var i=0;i<count;++i){view[i]=HEAP32[value+4*i>>>2]}}else{var view=HEAP32.subarray(value>>>2,value+count*4>>>2)}GLctx.uniform1iv(webglGetUniformLocation(location),view)}function _emscripten_glUniform2f(location,v0,v1){GLctx.uniform2f(webglGetUniformLocation(location),v0,v1)}function _emscripten_glUniform2fv(location,count,value){if(count<=144){var view=miniTempWebGLFloatBuffers[2*count-1];for(var i=0;i<2*count;i+=2){view[i]=HEAPF32[value+4*i>>>2];view[i+1]=HEAPF32[value+(4*i+4)>>>2]}}else{var view=HEAPF32.subarray(value>>>2,value+count*8>>>2)}GLctx.uniform2fv(webglGetUniformLocation(location),view)}function _emscripten_glUniform2i(location,v0,v1){GLctx.uniform2i(webglGetUniformLocation(location),v0,v1)}function _emscripten_glUniform2iv(location,count,value){if(count<=144){var view=__miniTempWebGLIntBuffers[2*count-1];for(var i=0;i<2*count;i+=2){view[i]=HEAP32[value+4*i>>>2];view[i+1]=HEAP32[value+(4*i+4)>>>2]}}else{var view=HEAP32.subarray(value>>>2,value+count*8>>>2)}GLctx.uniform2iv(webglGetUniformLocation(location),view)}function _emscripten_glUniform3f(location,v0,v1,v2){GLctx.uniform3f(webglGetUniformLocation(location),v0,v1,v2)}function _emscripten_glUniform3fv(location,count,value){if(count<=96){var view=miniTempWebGLFloatBuffers[3*count-1];for(var i=0;i<3*count;i+=3){view[i]=HEAPF32[value+4*i>>>2];view[i+1]=HEAPF32[value+(4*i+4)>>>2];view[i+2]=HEAPF32[value+(4*i+8)>>>2]}}else{var view=HEAPF32.subarray(value>>>2,value+count*12>>>2)}GLctx.uniform3fv(webglGetUniformLocation(location),view)}function _emscripten_glUniform3i(location,v0,v1,v2){GLctx.uniform3i(webglGetUniformLocation(location),v0,v1,v2)}function _emscripten_glUniform3iv(location,count,value){if(count<=96){var view=__miniTempWebGLIntBuffers[3*count-1];for(var i=0;i<3*count;i+=3){view[i]=HEAP32[value+4*i>>>2];view[i+1]=HEAP32[value+(4*i+4)>>>2];view[i+2]=HEAP32[value+(4*i+8)>>>2]}}else{var view=HEAP32.subarray(value>>>2,value+count*12>>>2)}GLctx.uniform3iv(webglGetUniformLocation(location),view)}function _emscripten_glUniform4f(location,v0,v1,v2,v3){GLctx.uniform4f(webglGetUniformLocation(location),v0,v1,v2,v3)}function _emscripten_glUniform4fv(location,count,value){if(count<=72){var view=miniTempWebGLFloatBuffers[4*count-1];var heap=HEAPF32;value>>=2;for(var i=0;i<4*count;i+=4){var dst=value+i;view[i]=heap[dst>>>0];view[i+1]=heap[dst+1>>>0];view[i+2]=heap[dst+2>>>0];view[i+3]=heap[dst+3>>>0]}}else{var view=HEAPF32.subarray(value>>>2,value+count*16>>>2)}GLctx.uniform4fv(webglGetUniformLocation(location),view)}function _emscripten_glUniform4i(location,v0,v1,v2,v3){GLctx.uniform4i(webglGetUniformLocation(location),v0,v1,v2,v3)}function _emscripten_glUniform4iv(location,count,value){if(count<=72){var view=__miniTempWebGLIntBuffers[4*count-1];for(var i=0;i<4*count;i+=4){view[i]=HEAP32[value+4*i>>>2];view[i+1]=HEAP32[value+(4*i+4)>>>2];view[i+2]=HEAP32[value+(4*i+8)>>>2];view[i+3]=HEAP32[value+(4*i+12)>>>2]}}else{var view=HEAP32.subarray(value>>>2,value+count*16>>>2)}GLctx.uniform4iv(webglGetUniformLocation(location),view)}function _emscripten_glUniformMatrix2fv(location,count,transpose,value){if(count<=72){var view=miniTempWebGLFloatBuffers[4*count-1];for(var i=0;i<4*count;i+=4){view[i]=HEAPF32[value+4*i>>>2];view[i+1]=HEAPF32[value+(4*i+4)>>>2];view[i+2]=HEAPF32[value+(4*i+8)>>>2];view[i+3]=HEAPF32[value+(4*i+12)>>>2]}}else{var view=HEAPF32.subarray(value>>>2,value+count*16>>>2)}GLctx.uniformMatrix2fv(webglGetUniformLocation(location),!!transpose,view)}function _emscripten_glUniformMatrix3fv(location,count,transpose,value){if(count<=32){var view=miniTempWebGLFloatBuffers[9*count-1];for(var i=0;i<9*count;i+=9){view[i]=HEAPF32[value+4*i>>>2];view[i+1]=HEAPF32[value+(4*i+4)>>>2];view[i+2]=HEAPF32[value+(4*i+8)>>>2];view[i+3]=HEAPF32[value+(4*i+12)>>>2];view[i+4]=HEAPF32[value+(4*i+16)>>>2];view[i+5]=HEAPF32[value+(4*i+20)>>>2];view[i+6]=HEAPF32[value+(4*i+24)>>>2];view[i+7]=HEAPF32[value+(4*i+28)>>>2];view[i+8]=HEAPF32[value+(4*i+32)>>>2]}}else{var view=HEAPF32.subarray(value>>>2,value+count*36>>>2)}GLctx.uniformMatrix3fv(webglGetUniformLocation(location),!!transpose,view)}function _emscripten_glUniformMatrix4fv(location,count,transpose,value){if(count<=18){var view=miniTempWebGLFloatBuffers[16*count-1];var heap=HEAPF32;value>>=2;for(var i=0;i<16*count;i+=16){var dst=value+i;view[i]=heap[dst>>>0];view[i+1]=heap[dst+1>>>0];view[i+2]=heap[dst+2>>>0];view[i+3]=heap[dst+3>>>0];view[i+4]=heap[dst+4>>>0];view[i+5]=heap[dst+5>>>0];view[i+6]=heap[dst+6>>>0];view[i+7]=heap[dst+7>>>0];view[i+8]=heap[dst+8>>>0];view[i+9]=heap[dst+9>>>0];view[i+10]=heap[dst+10>>>0];view[i+11]=heap[dst+11>>>0];view[i+12]=heap[dst+12>>>0];view[i+13]=heap[dst+13>>>0];view[i+14]=heap[dst+14>>>0];view[i+15]=heap[dst+15>>>0]}}else{var view=HEAPF32.subarray(value>>>2,value+count*64>>>2)}GLctx.uniformMatrix4fv(webglGetUniformLocation(location),!!transpose,view)}function _emscripten_glUseProgram(program){program=GL.programs[program];GLctx.useProgram(program);GLctx.currentProgram=program}function _emscripten_glValidateProgram(program){GLctx.validateProgram(GL.programs[program])}function _emscripten_glVertexAttrib1f(x0,x1){GLctx["vertexAttrib1f"](x0,x1)}function _emscripten_glVertexAttrib1fv(index,v){GLctx.vertexAttrib1f(index,HEAPF32[v>>>2])}function _emscripten_glVertexAttrib2f(x0,x1,x2){GLctx["vertexAttrib2f"](x0,x1,x2)}function _emscripten_glVertexAttrib2fv(index,v){GLctx.vertexAttrib2f(index,HEAPF32[v>>>2],HEAPF32[v+4>>>2])}function _emscripten_glVertexAttrib3f(x0,x1,x2,x3){GLctx["vertexAttrib3f"](x0,x1,x2,x3)}function _emscripten_glVertexAttrib3fv(index,v){GLctx.vertexAttrib3f(index,HEAPF32[v>>>2],HEAPF32[v+4>>>2],HEAPF32[v+8>>>2])}function _emscripten_glVertexAttrib4f(x0,x1,x2,x3,x4){GLctx["vertexAttrib4f"](x0,x1,x2,x3,x4)}function _emscripten_glVertexAttrib4fv(index,v){GLctx.vertexAttrib4f(index,HEAPF32[v>>>2],HEAPF32[v+4>>>2],HEAPF32[v+8>>>2],HEAPF32[v+12>>>2])}function _emscripten_glVertexAttribDivisorANGLE(index,divisor){GLctx["vertexAttribDivisor"](index,divisor)}function _emscripten_glVertexAttribPointer(index,size,type,normalized,stride,ptr){GLctx.vertexAttribPointer(index,size,type,!!normalized,stride,ptr)}function _emscripten_glViewport(x0,x1,x2,x3){GLctx["viewport"](x0,x1,x2,x3)}function _emscripten_memcpy_big(dest,src,num){HEAPU8.copyWithin(dest>>>0,src>>>0,src+num>>>0)}function emscripten_realloc_buffer(size){try{wasmMemory.grow(size-buffer.byteLength+65535>>>16);updateGlobalBufferAndViews(wasmMemory.buffer);return 1}catch(e){}}function _emscripten_resize_heap(requestedSize){var oldSize=HEAPU8.length;requestedSize=requestedSize>>>0;var maxHeapSize=getHeapMax();if(requestedSize>maxHeapSize){return false}let alignUp=(x,multiple)=>x+(multiple-x%multiple)%multiple;for(var cutDown=1;cutDown<=4;cutDown*=2){var overGrownHeapSize=oldSize*(1+.2/cutDown);overGrownHeapSize=Math.min(overGrownHeapSize,requestedSize+100663296);var newSize=Math.min(maxHeapSize,alignUp(Math.max(requestedSize,overGrownHeapSize),65536));var replacement=emscripten_realloc_buffer(newSize);if(replacement){return true}}return false}function _emscripten_set_canvas_element_size(target,width,height){var canvas=findCanvasEventTarget(target);if(!canvas)return-4;canvas.width=width;canvas.height=height;return 0}function _emscripten_set_element_css_size(target,width,height){target=findEventTarget(target);if(!target)return-4;target.style.width=width+"px";target.style.height=height+"px";return 0}function _emscripten_webgl_enable_extension(contextHandle,extension){var context=GL.getContext(contextHandle);var extString=UTF8ToString(extension);if(extString.startsWith("GL_"))extString=extString.substr(3);if(extString=="ANGLE_instanced_arrays")__webgl_enable_ANGLE_instanced_arrays(GLctx);if(extString=="OES_vertex_array_object")__webgl_enable_OES_vertex_array_object(GLctx);if(extString=="WEBGL_draw_buffers")__webgl_enable_WEBGL_draw_buffers(GLctx);if(extString=="WEBGL_multi_draw")__webgl_enable_WEBGL_multi_draw(GLctx);var ext=context.GLctx.getExtension(extString);return!!ext}var __emscripten_webgl_power_preferences=["default","low-power","high-performance"];function _emscripten_webgl_get_context_attributes(c,a){if(!a)return-5;c=GL.contexts[c];if(!c)return-3;var t=c.GLctx;if(!t)return-3;t=t.getContextAttributes();HEAP32[a>>>2]=t.alpha;HEAP32[a+4>>>2]=t.depth;HEAP32[a+8>>>2]=t.stencil;HEAP32[a+12>>>2]=t.antialias;HEAP32[a+16>>>2]=t.premultipliedAlpha;HEAP32[a+20>>>2]=t.preserveDrawingBuffer;var power=t["powerPreference"]&&__emscripten_webgl_power_preferences.indexOf(t["powerPreference"]);HEAP32[a+24>>>2]=power;HEAP32[a+28>>>2]=t.failIfMajorPerformanceCaveat;HEAP32[a+32>>>2]=c.version;HEAP32[a+36>>>2]=0;HEAP32[a+40>>>2]=c.attributes.enableExtensionsByDefault;return 0}function _emscripten_webgl_do_get_current_context(){return GL.currentContext?GL.currentContext.handle:0}function _emscripten_webgl_get_current_context(){return _emscripten_webgl_do_get_current_context()}var ENV={};function getExecutableName(){return thisProgram||"./this.program"}function getEnvStrings(){if(!getEnvStrings.strings){var lang=(typeof navigator=="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8";var env={"USER":"web_user","LOGNAME":"web_user","PATH":"/","PWD":"/","HOME":"/home/web_user","LANG":lang,"_":getExecutableName()};for(var x in ENV){if(ENV[x]===undefined)delete env[x];else env[x]=ENV[x]}var strings=[];for(var x in env){strings.push(x+"="+env[x])}getEnvStrings.strings=strings}return getEnvStrings.strings}function _environ_get(__environ,environ_buf){var bufSize=0;getEnvStrings().forEach(function(string,i){var ptr=environ_buf+bufSize;HEAPU32[__environ+i*4>>>2]=ptr;writeAsciiToMemory(string,ptr);bufSize+=string.length+1});return 0}function _environ_sizes_get(penviron_count,penviron_buf_size){var strings=getEnvStrings();HEAPU32[penviron_count>>>2]=strings.length;var bufSize=0;strings.forEach(function(string){bufSize+=string.length+1});HEAPU32[penviron_buf_size>>>2]=bufSize;return 0}function _fd_close(fd){try{var stream=SYSCALLS.getStreamFromFD(fd);FS.close(stream);return 0}catch(e){if(typeof FS=="undefined"||!(e instanceof FS.ErrnoError))throw e;return e.errno}}function _fd_fdstat_get(fd,pbuf){try{var stream=SYSCALLS.getStreamFromFD(fd);var type=stream.tty?2:FS.isDir(stream.mode)?3:FS.isLink(stream.mode)?7:4;HEAP8[pbuf>>>0]=type;return 0}catch(e){if(typeof FS=="undefined"||!(e instanceof FS.ErrnoError))throw e;return e.errno}}function doReadv(stream,iov,iovcnt,offset){var ret=0;for(var i=0;i<iovcnt;i++){var ptr=HEAPU32[iov>>>2];var len=HEAPU32[iov+4>>>2];iov+=8;var curr=FS.read(stream,HEAP8,ptr,len,offset);if(curr<0)return-1;ret+=curr;if(curr<len)break}return ret}function _fd_read(fd,iov,iovcnt,pnum){try{var stream=SYSCALLS.getStreamFromFD(fd);var num=doReadv(stream,iov,iovcnt);HEAP32[pnum>>>2]=num;return 0}catch(e){if(typeof FS=="undefined"||!(e instanceof FS.ErrnoError))throw e;return e.errno}}function convertI32PairToI53Checked(lo,hi){return hi+2097152>>>0<4194305-!!lo?(lo>>>0)+hi*4294967296:NaN}function _fd_seek(fd,offset_low,offset_high,whence,newOffset){try{var offset=convertI32PairToI53Checked(offset_low,offset_high);if(isNaN(offset))return 61;var stream=SYSCALLS.getStreamFromFD(fd);FS.llseek(stream,offset,whence);tempI64=[stream.position>>>0,(tempDouble=stream.position,+Math.abs(tempDouble)>=1?tempDouble>0?(Math.min(+Math.floor(tempDouble/4294967296),4294967295)|0)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[newOffset>>>2]=tempI64[0],HEAP32[newOffset+4>>>2]=tempI64[1];if(stream.getdents&&offset===0&&whence===0)stream.getdents=null;return 0}catch(e){if(typeof FS=="undefined"||!(e instanceof FS.ErrnoError))throw e;return e.errno}}function doWritev(stream,iov,iovcnt,offset){var ret=0;for(var i=0;i<iovcnt;i++){var ptr=HEAPU32[iov>>>2];var len=HEAPU32[iov+4>>>2];iov+=8;var curr=FS.write(stream,HEAP8,ptr,len,offset);if(curr<0)return-1;ret+=curr}return ret}function _fd_write(fd,iov,iovcnt,pnum){try{var stream=SYSCALLS.getStreamFromFD(fd);var num=doWritev(stream,iov,iovcnt);HEAPU32[pnum>>>2]=num;return 0}catch(e){if(typeof FS=="undefined"||!(e instanceof FS.ErrnoError))throw e;return e.errno}}function _getTempRet0(){return getTempRet0()}function inetPton4(str){var b=str.split(".");for(var i=0;i<4;i++){var tmp=Number(b[i]);if(isNaN(tmp))return null;b[i]=tmp}return(b[0]|b[1]<<8|b[2]<<16|b[3]<<24)>>>0}function inetPton6(str){var words;var w,offset,z;var valid6regx=/^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i;var parts=[];if(!valid6regx.test(str)){return null}if(str==="::"){return[0,0,0,0,0,0,0,0]}if(str.startsWith("::")){str=str.replace("::","Z:")}else{str=str.replace("::",":Z:")}if(str.indexOf(".")>0){str=str.replace(new RegExp("[.]","g"),":");words=str.split(":");words[words.length-4]=jstoi_q(words[words.length-4])+jstoi_q(words[words.length-3])*256;words[words.length-3]=jstoi_q(words[words.length-2])+jstoi_q(words[words.length-1])*256;words=words.slice(0,words.length-2)}else{words=str.split(":")}offset=0;z=0;for(w=0;w<words.length;w++){if(typeof words[w]=="string"){if(words[w]==="Z"){for(z=0;z<8-words.length+1;z++){parts[w+z]=0}offset=z-1}else{parts[w+offset]=_htons(parseInt(words[w],16))}}else{parts[w+offset]=words[w]}}return[parts[1]<<16|parts[0],parts[3]<<16|parts[2],parts[5]<<16|parts[4],parts[7]<<16|parts[6]]}var DNS={address_map:{id:1,addrs:{},names:{}},lookup_name:function(name){var res=inetPton4(name);if(res!==null){return name}res=inetPton6(name);if(res!==null){return name}var addr;if(DNS.address_map.addrs[name]){addr=DNS.address_map.addrs[name]}else{var id=DNS.address_map.id++;assert(id<65535,"exceeded max address mappings of 65535");addr="172.29."+(id&255)+"."+(id&65280);DNS.address_map.names[addr]=name;DNS.address_map.addrs[name]=addr}return addr},lookup_addr:function(addr){if(DNS.address_map.names[addr]){return DNS.address_map.names[addr]}return null}};function getHostByName(name){var ret=_malloc(20);var nameBuf=_malloc(name.length+1);stringToUTF8(name,nameBuf,name.length+1);HEAPU32[ret>>>2]=nameBuf;var aliasesBuf=_malloc(4);HEAPU32[aliasesBuf>>>2]=0;HEAPU32[ret+4>>>2]=aliasesBuf;var afinet=2;HEAP32[ret+8>>>2]=afinet;HEAP32[ret+12>>>2]=4;var addrListBuf=_malloc(12);HEAPU32[addrListBuf>>>2]=addrListBuf+8;HEAPU32[addrListBuf+4>>>2]=0;HEAP32[addrListBuf+8>>>2]=inetPton4(DNS.lookup_name(name));HEAPU32[ret+16>>>2]=addrListBuf;return ret}function _gethostbyname(name){return getHostByName(UTF8ToString(name))}function _glActiveTexture(x0){GLctx["activeTexture"](x0)}function _glAttachShader(program,shader){GLctx.attachShader(GL.programs[program],GL.shaders[shader])}function _glBindAttribLocation(program,index,name){GLctx.bindAttribLocation(GL.programs[program],index,UTF8ToString(name))}function _glBindBuffer(target,buffer){GLctx.bindBuffer(target,GL.buffers[buffer])}function _glBindFramebuffer(target,framebuffer){GLctx.bindFramebuffer(target,GL.framebuffers[framebuffer])}function _glBindRenderbuffer(target,renderbuffer){GLctx.bindRenderbuffer(target,GL.renderbuffers[renderbuffer])}function _glBindTexture(target,texture){GLctx.bindTexture(target,GL.textures[texture])}function _glBlendColor(x0,x1,x2,x3){GLctx["blendColor"](x0,x1,x2,x3)}function _glBlendEquation(x0){GLctx["blendEquation"](x0)}function _glBlendEquationSeparate(x0,x1){GLctx["blendEquationSeparate"](x0,x1)}function _glBlendFunc(x0,x1){GLctx["blendFunc"](x0,x1)}function _glBlendFuncSeparate(x0,x1,x2,x3){GLctx["blendFuncSeparate"](x0,x1,x2,x3)}function _glBufferData(target,size,data,usage){GLctx.bufferData(target,data?HEAPU8.subarray(data>>>0,data+size>>>0):size,usage)}function _glBufferSubData(target,offset,size,data){GLctx.bufferSubData(target,offset,HEAPU8.subarray(data>>>0,data+size>>>0))}function _glCheckFramebufferStatus(x0){return GLctx["checkFramebufferStatus"](x0)}function _glClear(x0){GLctx["clear"](x0)}function _glClearColor(x0,x1,x2,x3){GLctx["clearColor"](x0,x1,x2,x3)}function _glClearDepthf(x0){GLctx["clearDepth"](x0)}function _glClearStencil(x0){GLctx["clearStencil"](x0)}function _glColorMask(red,green,blue,alpha){GLctx.colorMask(!!red,!!green,!!blue,!!alpha)}function _glCompileShader(shader){GLctx.compileShader(GL.shaders[shader])}function _glCompressedTexImage2D(target,level,internalFormat,width,height,border,imageSize,data){GLctx["compressedTexImage2D"](target,level,internalFormat,width,height,border,data?HEAPU8.subarray(data>>>0,data+imageSize>>>0):null)}function _glCompressedTexSubImage2D(target,level,xoffset,yoffset,width,height,format,imageSize,data){GLctx["compressedTexSubImage2D"](target,level,xoffset,yoffset,width,height,format,data?HEAPU8.subarray(data>>>0,data+imageSize>>>0):null)}function _glCopyTexImage2D(x0,x1,x2,x3,x4,x5,x6,x7){GLctx["copyTexImage2D"](x0,x1,x2,x3,x4,x5,x6,x7)}function _glCopyTexSubImage2D(x0,x1,x2,x3,x4,x5,x6,x7){GLctx["copyTexSubImage2D"](x0,x1,x2,x3,x4,x5,x6,x7)}function _glCreateProgram(){var id=GL.getNewId(GL.programs);var program=GLctx.createProgram();program.name=id;program.maxUniformLength=program.maxAttributeLength=program.maxUniformBlockNameLength=0;program.uniformIdCounter=1;GL.programs[id]=program;return id}function _glCreateShader(shaderType){var id=GL.getNewId(GL.shaders);GL.shaders[id]=GLctx.createShader(shaderType);return id}function _glCullFace(x0){GLctx["cullFace"](x0)}function _glDeleteBuffers(n,buffers){for(var i=0;i<n;i++){var id=HEAP32[buffers+i*4>>>2];var buffer=GL.buffers[id];if(!buffer)continue;GLctx.deleteBuffer(buffer);buffer.name=0;GL.buffers[id]=null}}function _glDeleteFramebuffers(n,framebuffers){for(var i=0;i<n;++i){var id=HEAP32[framebuffers+i*4>>>2];var framebuffer=GL.framebuffers[id];if(!framebuffer)continue;GLctx.deleteFramebuffer(framebuffer);framebuffer.name=0;GL.framebuffers[id]=null}}function _glDeleteProgram(id){if(!id)return;var program=GL.programs[id];if(!program){GL.recordError(1281);return}GLctx.deleteProgram(program);program.name=0;GL.programs[id]=null}function _glDeleteRenderbuffers(n,renderbuffers){for(var i=0;i<n;i++){var id=HEAP32[renderbuffers+i*4>>>2];var renderbuffer=GL.renderbuffers[id];if(!renderbuffer)continue;GLctx.deleteRenderbuffer(renderbuffer);renderbuffer.name=0;GL.renderbuffers[id]=null}}function _glDeleteShader(id){if(!id)return;var shader=GL.shaders[id];if(!shader){GL.recordError(1281);return}GLctx.deleteShader(shader);GL.shaders[id]=null}function _glDeleteTextures(n,textures){for(var i=0;i<n;i++){var id=HEAP32[textures+i*4>>>2];var texture=GL.textures[id];if(!texture)continue;GLctx.deleteTexture(texture);texture.name=0;GL.textures[id]=null}}function _glDepthFunc(x0){GLctx["depthFunc"](x0)}function _glDepthMask(flag){GLctx.depthMask(!!flag)}function _glDepthRangef(x0,x1){GLctx["depthRange"](x0,x1)}function _glDetachShader(program,shader){GLctx.detachShader(GL.programs[program],GL.shaders[shader])}function _glDisable(x0){GLctx["disable"](x0)}function _glDisableVertexAttribArray(index){GLctx.disableVertexAttribArray(index)}function _glDrawArrays(mode,first,count){GLctx.drawArrays(mode,first,count)}function _glDrawElements(mode,count,type,indices){GLctx.drawElements(mode,count,type,indices)}function _glEnable(x0){GLctx["enable"](x0)}function _glEnableVertexAttribArray(index){GLctx.enableVertexAttribArray(index)}function _glFinish(){GLctx["finish"]()}function _glFlush(){GLctx["flush"]()}function _glFramebufferRenderbuffer(target,attachment,renderbuffertarget,renderbuffer){GLctx.framebufferRenderbuffer(target,attachment,renderbuffertarget,GL.renderbuffers[renderbuffer])}function _glFramebufferTexture2D(target,attachment,textarget,texture,level){GLctx.framebufferTexture2D(target,attachment,textarget,GL.textures[texture],level)}function _glFrontFace(x0){GLctx["frontFace"](x0)}function _glGenBuffers(n,buffers){__glGenObject(n,buffers,"createBuffer",GL.buffers)}function _glGenFramebuffers(n,ids){__glGenObject(n,ids,"createFramebuffer",GL.framebuffers)}function _glGenRenderbuffers(n,renderbuffers){__glGenObject(n,renderbuffers,"createRenderbuffer",GL.renderbuffers)}function _glGenTextures(n,textures){__glGenObject(n,textures,"createTexture",GL.textures)}function _glGenerateMipmap(x0){GLctx["generateMipmap"](x0)}function _glGetActiveAttrib(program,index,bufSize,length,size,type,name){__glGetActiveAttribOrUniform("getActiveAttrib",program,index,bufSize,length,size,type,name)}function _glGetActiveUniform(program,index,bufSize,length,size,type,name){__glGetActiveAttribOrUniform("getActiveUniform",program,index,bufSize,length,size,type,name)}function _glGetAttachedShaders(program,maxCount,count,shaders){var result=GLctx.getAttachedShaders(GL.programs[program]);var len=result.length;if(len>maxCount){len=maxCount}HEAP32[count>>>2]=len;for(var i=0;i<len;++i){var id=GL.shaders.indexOf(result[i]);HEAP32[shaders+i*4>>>2]=id}}function _glGetAttribLocation(program,name){return GLctx.getAttribLocation(GL.programs[program],UTF8ToString(name))}function _glGetBooleanv(name_,p){emscriptenWebGLGet(name_,p,4)}function _glGetBufferParameteriv(target,value,data){if(!data){GL.recordError(1281);return}HEAP32[data>>>2]=GLctx.getBufferParameter(target,value)}function _glGetError(){var error=GLctx.getError()||GL.lastError;GL.lastError=0;return error}function _glGetFloatv(name_,p){emscriptenWebGLGet(name_,p,2)}function _glGetFramebufferAttachmentParameteriv(target,attachment,pname,params){var result=GLctx.getFramebufferAttachmentParameter(target,attachment,pname);if(result instanceof WebGLRenderbuffer||result instanceof WebGLTexture){result=result.name|0}HEAP32[params>>>2]=result}function _glGetIntegerv(name_,p){emscriptenWebGLGet(name_,p,0)}function _glGetProgramInfoLog(program,maxLength,length,infoLog){var log=GLctx.getProgramInfoLog(GL.programs[program]);if(log===null)log="(unknown error)";var numBytesWrittenExclNull=maxLength>0&&infoLog?stringToUTF8(log,infoLog,maxLength):0;if(length)HEAP32[length>>>2]=numBytesWrittenExclNull}function _glGetProgramiv(program,pname,p){if(!p){GL.recordError(1281);return}if(program>=GL.counter){GL.recordError(1281);return}program=GL.programs[program];if(pname==35716){var log=GLctx.getProgramInfoLog(program);if(log===null)log="(unknown error)";HEAP32[p>>>2]=log.length+1}else if(pname==35719){if(!program.maxUniformLength){for(var i=0;i<GLctx.getProgramParameter(program,35718);++i){program.maxUniformLength=Math.max(program.maxUniformLength,GLctx.getActiveUniform(program,i).name.length+1)}}HEAP32[p>>>2]=program.maxUniformLength}else if(pname==35722){if(!program.maxAttributeLength){for(var i=0;i<GLctx.getProgramParameter(program,35721);++i){program.maxAttributeLength=Math.max(program.maxAttributeLength,GLctx.getActiveAttrib(program,i).name.length+1)}}HEAP32[p>>>2]=program.maxAttributeLength}else if(pname==35381){if(!program.maxUniformBlockNameLength){for(var i=0;i<GLctx.getProgramParameter(program,35382);++i){program.maxUniformBlockNameLength=Math.max(program.maxUniformBlockNameLength,GLctx.getActiveUniformBlockName(program,i).length+1)}}HEAP32[p>>>2]=program.maxUniformBlockNameLength}else{HEAP32[p>>>2]=GLctx.getProgramParameter(program,pname)}}function _glGetRenderbufferParameteriv(target,pname,params){if(!params){GL.recordError(1281);return}HEAP32[params>>>2]=GLctx.getRenderbufferParameter(target,pname)}function _glGetShaderInfoLog(shader,maxLength,length,infoLog){var log=GLctx.getShaderInfoLog(GL.shaders[shader]);if(log===null)log="(unknown error)";var numBytesWrittenExclNull=maxLength>0&&infoLog?stringToUTF8(log,infoLog,maxLength):0;if(length)HEAP32[length>>>2]=numBytesWrittenExclNull}function _glGetShaderPrecisionFormat(shaderType,precisionType,range,precision){var result=GLctx.getShaderPrecisionFormat(shaderType,precisionType);HEAP32[range>>>2]=result.rangeMin;HEAP32[range+4>>>2]=result.rangeMax;HEAP32[precision>>>2]=result.precision}function _glGetShaderSource(shader,bufSize,length,source){var result=GLctx.getShaderSource(GL.shaders[shader]);if(!result)return;var numBytesWrittenExclNull=bufSize>0&&source?stringToUTF8(result,source,bufSize):0;if(length)HEAP32[length>>>2]=numBytesWrittenExclNull}function _glGetShaderiv(shader,pname,p){if(!p){GL.recordError(1281);return}if(pname==35716){var log=GLctx.getShaderInfoLog(GL.shaders[shader]);if(log===null)log="(unknown error)";var logLength=log?log.length+1:0;HEAP32[p>>>2]=logLength}else if(pname==35720){var source=GLctx.getShaderSource(GL.shaders[shader]);var sourceLength=source?source.length+1:0;HEAP32[p>>>2]=sourceLength}else{HEAP32[p>>>2]=GLctx.getShaderParameter(GL.shaders[shader],pname)}}function _glGetString(name_){var ret=GL.stringCache[name_];if(!ret){switch(name_){case 7939:var exts=GLctx.getSupportedExtensions()||[];exts=exts.concat(exts.map(function(e){return"GL_"+e}));ret=stringToNewUTF8(exts.join(" "));break;case 7936:case 7937:case 37445:case 37446:var s=GLctx.getParameter(name_);if(!s){GL.recordError(1280)}ret=s&&stringToNewUTF8(s);break;case 7938:var glVersion=GLctx.getParameter(7938);{glVersion="OpenGL ES 2.0 ("+glVersion+")"}ret=stringToNewUTF8(glVersion);break;case 35724:var glslVersion=GLctx.getParameter(35724);var ver_re=/^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;var ver_num=glslVersion.match(ver_re);if(ver_num!==null){if(ver_num[1].length==3)ver_num[1]=ver_num[1]+"0";glslVersion="OpenGL ES GLSL ES "+ver_num[1]+" ("+glslVersion+")"}ret=stringToNewUTF8(glslVersion);break;default:GL.recordError(1280)}GL.stringCache[name_]=ret}return ret}function _glGetTexParameterfv(target,pname,params){if(!params){GL.recordError(1281);return}HEAPF32[params>>>2]=GLctx.getTexParameter(target,pname)}function _glGetTexParameteriv(target,pname,params){if(!params){GL.recordError(1281);return}HEAP32[params>>>2]=GLctx.getTexParameter(target,pname)}function _glGetUniformLocation(program,name){name=UTF8ToString(name);if(program=GL.programs[program]){webglPrepareUniformLocationsBeforeFirstUse(program);var uniformLocsById=program.uniformLocsById;var arrayIndex=0;var uniformBaseName=name;var leftBrace=webglGetLeftBracePos(name);if(leftBrace>0){arrayIndex=jstoi_q(name.slice(leftBrace+1))>>>0;uniformBaseName=name.slice(0,leftBrace)}var sizeAndId=program.uniformSizeAndIdsByName[uniformBaseName];if(sizeAndId&&arrayIndex<sizeAndId[0]){arrayIndex+=sizeAndId[1];if(uniformLocsById[arrayIndex]=uniformLocsById[arrayIndex]||GLctx.getUniformLocation(program,name)){return arrayIndex}}}else{GL.recordError(1281)}return-1}function _glGetUniformfv(program,location,params){emscriptenWebGLGetUniform(program,location,params,2)}function _glGetUniformiv(program,location,params){emscriptenWebGLGetUniform(program,location,params,0)}function _glGetVertexAttribPointerv(index,pname,pointer){if(!pointer){GL.recordError(1281);return}HEAP32[pointer>>>2]=GLctx.getVertexAttribOffset(index,pname)}function _glGetVertexAttribfv(index,pname,params){emscriptenWebGLGetVertexAttrib(index,pname,params,2)}function _glGetVertexAttribiv(index,pname,params){emscriptenWebGLGetVertexAttrib(index,pname,params,5)}function _glHint(x0,x1){GLctx["hint"](x0,x1)}function _glIsBuffer(buffer){var b=GL.buffers[buffer];if(!b)return 0;return GLctx.isBuffer(b)}function _glIsEnabled(x0){return GLctx["isEnabled"](x0)}function _glIsFramebuffer(framebuffer){var fb=GL.framebuffers[framebuffer];if(!fb)return 0;return GLctx.isFramebuffer(fb)}function _glIsProgram(program){program=GL.programs[program];if(!program)return 0;return GLctx.isProgram(program)}function _glIsRenderbuffer(renderbuffer){var rb=GL.renderbuffers[renderbuffer];if(!rb)return 0;return GLctx.isRenderbuffer(rb)}function _glIsShader(shader){var s=GL.shaders[shader];if(!s)return 0;return GLctx.isShader(s)}function _glIsTexture(id){var texture=GL.textures[id];if(!texture)return 0;return GLctx.isTexture(texture)}function _glLineWidth(x0){GLctx["lineWidth"](x0)}function _glLinkProgram(program){program=GL.programs[program];GLctx.linkProgram(program);program.uniformLocsById=0;program.uniformSizeAndIdsByName={}}function _glPixelStorei(pname,param){if(pname==3317){GL.unpackAlignment=param}GLctx.pixelStorei(pname,param)}function _glPolygonOffset(x0,x1){GLctx["polygonOffset"](x0,x1)}function _glReadPixels(x,y,width,height,format,type,pixels){var pixelData=emscriptenWebGLGetTexPixelData(type,format,width,height,pixels,format);if(!pixelData){GL.recordError(1280);return}GLctx.readPixels(x,y,width,height,format,type,pixelData)}function _glReleaseShaderCompiler(){}function _glRenderbufferStorage(x0,x1,x2,x3){GLctx["renderbufferStorage"](x0,x1,x2,x3)}function _glSampleCoverage(value,invert){GLctx.sampleCoverage(value,!!invert)}function _glScissor(x0,x1,x2,x3){GLctx["scissor"](x0,x1,x2,x3)}function _glShaderBinary(){GL.recordError(1280)}function _glShaderSource(shader,count,string,length){var source=GL.getSource(shader,count,string,length);GLctx.shaderSource(GL.shaders[shader],source)}function _glStencilFunc(x0,x1,x2){GLctx["stencilFunc"](x0,x1,x2)}function _glStencilFuncSeparate(x0,x1,x2,x3){GLctx["stencilFuncSeparate"](x0,x1,x2,x3)}function _glStencilMask(x0){GLctx["stencilMask"](x0)}function _glStencilMaskSeparate(x0,x1){GLctx["stencilMaskSeparate"](x0,x1)}function _glStencilOp(x0,x1,x2){GLctx["stencilOp"](x0,x1,x2)}function _glStencilOpSeparate(x0,x1,x2,x3){GLctx["stencilOpSeparate"](x0,x1,x2,x3)}function _glTexImage2D(target,level,internalFormat,width,height,border,format,type,pixels){GLctx.texImage2D(target,level,internalFormat,width,height,border,format,type,pixels?emscriptenWebGLGetTexPixelData(type,format,width,height,pixels,internalFormat):null)}function _glTexParameterf(x0,x1,x2){GLctx["texParameterf"](x0,x1,x2)}function _glTexParameterfv(target,pname,params){var param=HEAPF32[params>>>2];GLctx.texParameterf(target,pname,param)}function _glTexParameteri(x0,x1,x2){GLctx["texParameteri"](x0,x1,x2)}function _glTexParameteriv(target,pname,params){var param=HEAP32[params>>>2];GLctx.texParameteri(target,pname,param)}function _glTexSubImage2D(target,level,xoffset,yoffset,width,height,format,type,pixels){var pixelData=null;if(pixels)pixelData=emscriptenWebGLGetTexPixelData(type,format,width,height,pixels,0);GLctx.texSubImage2D(target,level,xoffset,yoffset,width,height,format,type,pixelData)}function _glUniform1f(location,v0){GLctx.uniform1f(webglGetUniformLocation(location),v0)}function _glUniform1fv(location,count,value){if(count<=288){var view=miniTempWebGLFloatBuffers[count-1];for(var i=0;i<count;++i){view[i]=HEAPF32[value+4*i>>>2]}}else{var view=HEAPF32.subarray(value>>>2,value+count*4>>>2)}GLctx.uniform1fv(webglGetUniformLocation(location),view)}function _glUniform1i(location,v0){GLctx.uniform1i(webglGetUniformLocation(location),v0)}function _glUniform1iv(location,count,value){if(count<=288){var view=__miniTempWebGLIntBuffers[count-1];for(var i=0;i<count;++i){view[i]=HEAP32[value+4*i>>>2]}}else{var view=HEAP32.subarray(value>>>2,value+count*4>>>2)}GLctx.uniform1iv(webglGetUniformLocation(location),view)}function _glUniform2f(location,v0,v1){GLctx.uniform2f(webglGetUniformLocation(location),v0,v1)}function _glUniform2fv(location,count,value){if(count<=144){var view=miniTempWebGLFloatBuffers[2*count-1];for(var i=0;i<2*count;i+=2){view[i]=HEAPF32[value+4*i>>>2];view[i+1]=HEAPF32[value+(4*i+4)>>>2]}}else{var view=HEAPF32.subarray(value>>>2,value+count*8>>>2)}GLctx.uniform2fv(webglGetUniformLocation(location),view)}function _glUniform2i(location,v0,v1){GLctx.uniform2i(webglGetUniformLocation(location),v0,v1)}function _glUniform2iv(location,count,value){if(count<=144){var view=__miniTempWebGLIntBuffers[2*count-1];for(var i=0;i<2*count;i+=2){view[i]=HEAP32[value+4*i>>>2];view[i+1]=HEAP32[value+(4*i+4)>>>2]}}else{var view=HEAP32.subarray(value>>>2,value+count*8>>>2)}GLctx.uniform2iv(webglGetUniformLocation(location),view)}function _glUniform3f(location,v0,v1,v2){GLctx.uniform3f(webglGetUniformLocation(location),v0,v1,v2)}function _glUniform3fv(location,count,value){if(count<=96){var view=miniTempWebGLFloatBuffers[3*count-1];for(var i=0;i<3*count;i+=3){view[i]=HEAPF32[value+4*i>>>2];view[i+1]=HEAPF32[value+(4*i+4)>>>2];view[i+2]=HEAPF32[value+(4*i+8)>>>2]}}else{var view=HEAPF32.subarray(value>>>2,value+count*12>>>2)}GLctx.uniform3fv(webglGetUniformLocation(location),view)}function _glUniform3i(location,v0,v1,v2){GLctx.uniform3i(webglGetUniformLocation(location),v0,v1,v2)}function _glUniform3iv(location,count,value){if(count<=96){var view=__miniTempWebGLIntBuffers[3*count-1];for(var i=0;i<3*count;i+=3){view[i]=HEAP32[value+4*i>>>2];view[i+1]=HEAP32[value+(4*i+4)>>>2];view[i+2]=HEAP32[value+(4*i+8)>>>2]}}else{var view=HEAP32.subarray(value>>>2,value+count*12>>>2)}GLctx.uniform3iv(webglGetUniformLocation(location),view)}function _glUniform4f(location,v0,v1,v2,v3){GLctx.uniform4f(webglGetUniformLocation(location),v0,v1,v2,v3)}function _glUniform4fv(location,count,value){if(count<=72){var view=miniTempWebGLFloatBuffers[4*count-1];var heap=HEAPF32;value>>=2;for(var i=0;i<4*count;i+=4){var dst=value+i;view[i]=heap[dst>>>0];view[i+1]=heap[dst+1>>>0];view[i+2]=heap[dst+2>>>0];view[i+3]=heap[dst+3>>>0]}}else{var view=HEAPF32.subarray(value>>>2,value+count*16>>>2)}GLctx.uniform4fv(webglGetUniformLocation(location),view)}function _glUniform4i(location,v0,v1,v2,v3){GLctx.uniform4i(webglGetUniformLocation(location),v0,v1,v2,v3)}function _glUniform4iv(location,count,value){if(count<=72){var view=__miniTempWebGLIntBuffers[4*count-1];for(var i=0;i<4*count;i+=4){view[i]=HEAP32[value+4*i>>>2];view[i+1]=HEAP32[value+(4*i+4)>>>2];view[i+2]=HEAP32[value+(4*i+8)>>>2];view[i+3]=HEAP32[value+(4*i+12)>>>2]}}else{var view=HEAP32.subarray(value>>>2,value+count*16>>>2)}GLctx.uniform4iv(webglGetUniformLocation(location),view)}function _glUniformMatrix2fv(location,count,transpose,value){if(count<=72){var view=miniTempWebGLFloatBuffers[4*count-1];for(var i=0;i<4*count;i+=4){view[i]=HEAPF32[value+4*i>>>2];view[i+1]=HEAPF32[value+(4*i+4)>>>2];view[i+2]=HEAPF32[value+(4*i+8)>>>2];view[i+3]=HEAPF32[value+(4*i+12)>>>2]}}else{var view=HEAPF32.subarray(value>>>2,value+count*16>>>2)}GLctx.uniformMatrix2fv(webglGetUniformLocation(location),!!transpose,view)}function _glUniformMatrix3fv(location,count,transpose,value){if(count<=32){var view=miniTempWebGLFloatBuffers[9*count-1];for(var i=0;i<9*count;i+=9){view[i]=HEAPF32[value+4*i>>>2];view[i+1]=HEAPF32[value+(4*i+4)>>>2];view[i+2]=HEAPF32[value+(4*i+8)>>>2];view[i+3]=HEAPF32[value+(4*i+12)>>>2];view[i+4]=HEAPF32[value+(4*i+16)>>>2];view[i+5]=HEAPF32[value+(4*i+20)>>>2];view[i+6]=HEAPF32[value+(4*i+24)>>>2];view[i+7]=HEAPF32[value+(4*i+28)>>>2];view[i+8]=HEAPF32[value+(4*i+32)>>>2]}}else{var view=HEAPF32.subarray(value>>>2,value+count*36>>>2)}GLctx.uniformMatrix3fv(webglGetUniformLocation(location),!!transpose,view)}function _glUniformMatrix4fv(location,count,transpose,value){if(count<=18){var view=miniTempWebGLFloatBuffers[16*count-1];var heap=HEAPF32;value>>=2;for(var i=0;i<16*count;i+=16){var dst=value+i;view[i]=heap[dst>>>0];view[i+1]=heap[dst+1>>>0];view[i+2]=heap[dst+2>>>0];view[i+3]=heap[dst+3>>>0];view[i+4]=heap[dst+4>>>0];view[i+5]=heap[dst+5>>>0];view[i+6]=heap[dst+6>>>0];view[i+7]=heap[dst+7>>>0];view[i+8]=heap[dst+8>>>0];view[i+9]=heap[dst+9>>>0];view[i+10]=heap[dst+10>>>0];view[i+11]=heap[dst+11>>>0];view[i+12]=heap[dst+12>>>0];view[i+13]=heap[dst+13>>>0];view[i+14]=heap[dst+14>>>0];view[i+15]=heap[dst+15>>>0]}}else{var view=HEAPF32.subarray(value>>>2,value+count*64>>>2)}GLctx.uniformMatrix4fv(webglGetUniformLocation(location),!!transpose,view)}function _glUseProgram(program){program=GL.programs[program];GLctx.useProgram(program);GLctx.currentProgram=program}function _glValidateProgram(program){GLctx.validateProgram(GL.programs[program])}function _glVertexAttrib1f(x0,x1){GLctx["vertexAttrib1f"](x0,x1)}function _glVertexAttrib1fv(index,v){GLctx.vertexAttrib1f(index,HEAPF32[v>>>2])}function _glVertexAttrib2f(x0,x1,x2){GLctx["vertexAttrib2f"](x0,x1,x2)}function _glVertexAttrib2fv(index,v){GLctx.vertexAttrib2f(index,HEAPF32[v>>>2],HEAPF32[v+4>>>2])}function _glVertexAttrib3f(x0,x1,x2,x3){GLctx["vertexAttrib3f"](x0,x1,x2,x3)}function _glVertexAttrib3fv(index,v){GLctx.vertexAttrib3f(index,HEAPF32[v>>>2],HEAPF32[v+4>>>2],HEAPF32[v+8>>>2])}function _glVertexAttrib4f(x0,x1,x2,x3,x4){GLctx["vertexAttrib4f"](x0,x1,x2,x3,x4)}function _glVertexAttrib4fv(index,v){GLctx.vertexAttrib4f(index,HEAPF32[v>>>2],HEAPF32[v+4>>>2],HEAPF32[v+8>>>2],HEAPF32[v+12>>>2])}function _glVertexAttribPointer(index,size,type,normalized,stride,ptr){GLctx.vertexAttribPointer(index,size,type,!!normalized,stride,ptr)}function _glViewport(x0,x1,x2,x3){GLctx["viewport"](x0,x1,x2,x3)}function _llvm_eh_typeid_for(type){return type}function _setTempRet0(val){setTempRet0(val)}function __isLeapYear(year){return year%4===0&&(year%100!==0||year%400===0)}function __arraySum(array,index){var sum=0;for(var i=0;i<=index;sum+=array[i++]){}return sum}var __MONTH_DAYS_LEAP=[31,29,31,30,31,30,31,31,30,31,30,31];var __MONTH_DAYS_REGULAR=[31,28,31,30,31,30,31,31,30,31,30,31];function __addDays(date,days){var newDate=new Date(date.getTime());while(days>0){var leap=__isLeapYear(newDate.getFullYear());var currentMonth=newDate.getMonth();var daysInCurrentMonth=(leap?__MONTH_DAYS_LEAP:__MONTH_DAYS_REGULAR)[currentMonth];if(days>daysInCurrentMonth-newDate.getDate()){days-=daysInCurrentMonth-newDate.getDate()+1;newDate.setDate(1);if(currentMonth<11){newDate.setMonth(currentMonth+1)}else{newDate.setMonth(0);newDate.setFullYear(newDate.getFullYear()+1)}}else{newDate.setDate(newDate.getDate()+days);return newDate}}return newDate}function _strftime(s,maxsize,format,tm){var tm_zone=HEAP32[tm+40>>>2];var date={tm_sec:HEAP32[tm>>>2],tm_min:HEAP32[tm+4>>>2],tm_hour:HEAP32[tm+8>>>2],tm_mday:HEAP32[tm+12>>>2],tm_mon:HEAP32[tm+16>>>2],tm_year:HEAP32[tm+20>>>2],tm_wday:HEAP32[tm+24>>>2],tm_yday:HEAP32[tm+28>>>2],tm_isdst:HEAP32[tm+32>>>2],tm_gmtoff:HEAP32[tm+36>>>2],tm_zone:tm_zone?UTF8ToString(tm_zone):""};var pattern=UTF8ToString(format);var EXPANSION_RULES_1={"%c":"%a %b %d %H:%M:%S %Y","%D":"%m/%d/%y","%F":"%Y-%m-%d","%h":"%b","%r":"%I:%M:%S %p","%R":"%H:%M","%T":"%H:%M:%S","%x":"%m/%d/%y","%X":"%H:%M:%S","%Ec":"%c","%EC":"%C","%Ex":"%m/%d/%y","%EX":"%H:%M:%S","%Ey":"%y","%EY":"%Y","%Od":"%d","%Oe":"%e","%OH":"%H","%OI":"%I","%Om":"%m","%OM":"%M","%OS":"%S","%Ou":"%u","%OU":"%U","%OV":"%V","%Ow":"%w","%OW":"%W","%Oy":"%y"};for(var rule in EXPANSION_RULES_1){pattern=pattern.replace(new RegExp(rule,"g"),EXPANSION_RULES_1[rule])}var WEEKDAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];var MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];function leadingSomething(value,digits,character){var str=typeof value=="number"?value.toString():value||"";while(str.length<digits){str=character[0]+str}return str}function leadingNulls(value,digits){return leadingSomething(value,digits,"0")}function compareByDay(date1,date2){function sgn(value){return value<0?-1:value>0?1:0}var compare;if((compare=sgn(date1.getFullYear()-date2.getFullYear()))===0){if((compare=sgn(date1.getMonth()-date2.getMonth()))===0){compare=sgn(date1.getDate()-date2.getDate())}}return compare}function getFirstWeekStartDate(janFourth){switch(janFourth.getDay()){case 0:return new Date(janFourth.getFullYear()-1,11,29);case 1:return janFourth;case 2:return new Date(janFourth.getFullYear(),0,3);case 3:return new Date(janFourth.getFullYear(),0,2);case 4:return new Date(janFourth.getFullYear(),0,1);case 5:return new Date(janFourth.getFullYear()-1,11,31);case 6:return new Date(janFourth.getFullYear()-1,11,30)}}function getWeekBasedYear(date){var thisDate=__addDays(new Date(date.tm_year+1900,0,1),date.tm_yday);var janFourthThisYear=new Date(thisDate.getFullYear(),0,4);var janFourthNextYear=new Date(thisDate.getFullYear()+1,0,4);var firstWeekStartThisYear=getFirstWeekStartDate(janFourthThisYear);var firstWeekStartNextYear=getFirstWeekStartDate(janFourthNextYear);if(compareByDay(firstWeekStartThisYear,thisDate)<=0){if(compareByDay(firstWeekStartNextYear,thisDate)<=0){return thisDate.getFullYear()+1}else{return thisDate.getFullYear()}}else{return thisDate.getFullYear()-1}}var EXPANSION_RULES_2={"%a":function(date){return WEEKDAYS[date.tm_wday].substring(0,3)},"%A":function(date){return WEEKDAYS[date.tm_wday]},"%b":function(date){return MONTHS[date.tm_mon].substring(0,3)},"%B":function(date){return MONTHS[date.tm_mon]},"%C":function(date){var year=date.tm_year+1900;return leadingNulls(year/100|0,2)},"%d":function(date){return leadingNulls(date.tm_mday,2)},"%e":function(date){return leadingSomething(date.tm_mday,2," ")},"%g":function(date){return getWeekBasedYear(date).toString().substring(2)},"%G":function(date){return getWeekBasedYear(date)},"%H":function(date){return leadingNulls(date.tm_hour,2)},"%I":function(date){var twelveHour=date.tm_hour;if(twelveHour==0)twelveHour=12;else if(twelveHour>12)twelveHour-=12;return leadingNulls(twelveHour,2)},"%j":function(date){return leadingNulls(date.tm_mday+__arraySum(__isLeapYear(date.tm_year+1900)?__MONTH_DAYS_LEAP:__MONTH_DAYS_REGULAR,date.tm_mon-1),3)},"%m":function(date){return leadingNulls(date.tm_mon+1,2)},"%M":function(date){return leadingNulls(date.tm_min,2)},"%n":function(){return"\n"},"%p":function(date){if(date.tm_hour>=0&&date.tm_hour<12){return"AM"}else{return"PM"}},"%S":function(date){return leadingNulls(date.tm_sec,2)},"%t":function(){return"\t"},"%u":function(date){return date.tm_wday||7},"%U":function(date){var days=date.tm_yday+7-date.tm_wday;return leadingNulls(Math.floor(days/7),2)},"%V":function(date){var val=Math.floor((date.tm_yday+7-(date.tm_wday+6)%7)/7);if((date.tm_wday+371-date.tm_yday-2)%7<=2){val++}if(!val){val=52;var dec31=(date.tm_wday+7-date.tm_yday-1)%7;if(dec31==4||dec31==5&&__isLeapYear(date.tm_year%400-1)){val++}}else if(val==53){var jan1=(date.tm_wday+371-date.tm_yday)%7;if(jan1!=4&&(jan1!=3||!__isLeapYear(date.tm_year)))val=1}return leadingNulls(val,2)},"%w":function(date){return date.tm_wday},"%W":function(date){var days=date.tm_yday+7-(date.tm_wday+6)%7;return leadingNulls(Math.floor(days/7),2)},"%y":function(date){return(date.tm_year+1900).toString().substring(2)},"%Y":function(date){return date.tm_year+1900},"%z":function(date){var off=date.tm_gmtoff;var ahead=off>=0;off=Math.abs(off)/60;off=off/60*100+off%60;return(ahead?"+":"-")+String("0000"+off).slice(-4)},"%Z":function(date){return date.tm_zone},"%%":function(){return"%"}};pattern=pattern.replace(/%%/g,"\0\0");for(var rule in EXPANSION_RULES_2){if(pattern.includes(rule)){pattern=pattern.replace(new RegExp(rule,"g"),EXPANSION_RULES_2[rule](date))}}pattern=pattern.replace(/\0\0/g,"%");var bytes=intArrayFromString(pattern,false);if(bytes.length>maxsize){return 0}writeArrayToMemory(bytes,s);return bytes.length-1}function _strftime_l(s,maxsize,format,tm){return _strftime(s,maxsize,format,tm)}var FSNode=function(parent,name,mode,rdev){if(!parent){parent=this}this.parent=parent;this.mount=parent.mount;this.mounted=null;this.id=FS.nextInode++;this.name=name;this.mode=mode;this.node_ops={};this.stream_ops={};this.rdev=rdev};var readMode=292|73;var writeMode=146;Object.defineProperties(FSNode.prototype,{read:{get:function(){return(this.mode&readMode)===readMode},set:function(val){val?this.mode|=readMode:this.mode&=~readMode}},write:{get:function(){return(this.mode&writeMode)===writeMode},set:function(val){val?this.mode|=writeMode:this.mode&=~writeMode}},isFolder:{get:function(){return FS.isDir(this.mode)}},isDevice:{get:function(){return FS.isChrdev(this.mode)}}});FS.FSNode=FSNode;FS.staticInit();embind_init_charCodes();BindingError=Module["BindingError"]=extendError(Error,"BindingError");InternalError=Module["InternalError"]=extendError(Error,"InternalError");init_ClassHandle();init_embind();init_RegisteredPointer();UnboundTypeError=Module["UnboundTypeError"]=extendError(Error,"UnboundTypeError");init_emval();Module["requestFullscreen"]=function Module_requestFullscreen(lockPointer,resizeCanvas){Browser.requestFullscreen(lockPointer,resizeCanvas)};Module["requestAnimationFrame"]=function Module_requestAnimationFrame(func){Browser.requestAnimationFrame(func)};Module["setCanvasSize"]=function Module_setCanvasSize(width,height,noUpdates){Browser.setCanvasSize(width,height,noUpdates)};Module["pauseMainLoop"]=function Module_pauseMainLoop(){Browser.mainLoop.pause()};Module["resumeMainLoop"]=function Module_resumeMainLoop(){Browser.mainLoop.resume()};Module["getUserMedia"]=function Module_getUserMedia(){Browser.getUserMedia()};Module["createContext"]=function Module_createContext(canvas,useWebGL,setInModule,webGLContextAttributes){return Browser.createContext(canvas,useWebGL,setInModule,webGLContextAttributes)};var preloadedImages={};var preloadedAudios={};var GLctx;for(var i=0;i<32;++i)tempFixedLengthArray.push(new Array(i));var miniTempWebGLFloatBuffersStorage=new Float32Array(288);for(var i=0;i<288;++i){miniTempWebGLFloatBuffers[i]=miniTempWebGLFloatBuffersStorage.subarray(0,i+1)}var __miniTempWebGLIntBuffersStorage=new Int32Array(288);for(var i=0;i<288;++i){__miniTempWebGLIntBuffers[i]=__miniTempWebGLIntBuffersStorage.subarray(0,i+1)}function intArrayFromString(stringy,dontAddNull,length){var len=length>0?length:lengthBytesUTF8(stringy)+1;var u8array=new Array(len);var numBytesWritten=stringToUTF8Array(stringy,u8array,0,u8array.length);if(dontAddNull)u8array.length=numBytesWritten;return u8array}var asmLibraryArg={"mr":OSD_MemInfo_getModuleHeapLength,"za":___assert_fail,"on":___call_sighandler,"p":___cxa_allocate_exception,"V":___cxa_begin_catch,"pa":___cxa_end_catch,"b":___cxa_find_matching_catch_2,"q":___cxa_find_matching_catch_3,"td":___cxa_find_matching_catch_4,"xf":___cxa_find_matching_catch_5,"r":___cxa_free_exception,"wh":___cxa_rethrow,"t":___cxa_throw,"kn":___cxa_uncaught_exceptions,"e":___resumeException,"Jn":___syscall_chdir,"In":___syscall_chmod,"Kn":___syscall_faccessat,"qh":___syscall_fcntl64,"An":___syscall_fstat64,"wn":___syscall_getcwd,"qn":___syscall_getdents64,"Ln":___syscall_ioctl,"yn":___syscall_lstat64,"sn":___syscall_mkdirat,"xn":___syscall_newfstatat,"Cj":___syscall_openat,"pn":___syscall_rmdir,"zn":___syscall_stat64,"nn":___syscall_statfs64,"ln":___syscall_unlinkat,"Fn":__dlinit,"Hn":__dlopen_js,"Gn":__dlsym_js,"Ls":__embind_register_bigint,"Tq":__embind_register_bool,"i":__embind_register_class,"m":__embind_register_class_class_function,"k":__embind_register_class_constructor,"d":__embind_register_class_function,"R":__embind_register_class_property,"Sq":__embind_register_emval,"Q":__embind_register_enum,"P":__embind_register_enum_value,"Gj":__embind_register_float,"Bd":__embind_register_integer,"jc":__embind_register_memory_view,"Hj":__embind_register_std_string,"th":__embind_register_std_wstring,"Uq":__embind_register_void,"ph":__emscripten_date_now,"Cn":__emscripten_get_now_is_monotonic,"Qa":__emval_as,"pr":__emval_call_method,"ts":__emval_decref,"Hr":__emval_get_global,"lr":__emval_get_method_caller,"wr":__emval_get_property,"as":__emval_incref,"dr":__emval_new_cstring,"wt":__emval_run_destructors,"Yq":__emval_set_property,"Pa":__emval_take_value,"Rr":__emval_typeof,"Dn":__localtime_js,"rn":__munmap_js,"En":__tzset_js,"mh":_abort,"Zq":_eglBindAPI,"Lj":_eglChooseConfig,"Mj":_eglCreateContext,"er":_eglCreateWindowSurface,"br":_eglDestroyContext,"cr":_eglDestroySurface,"Qj":_eglGetCurrentContext,"Rj":_eglGetCurrentDisplay,"uh":_eglGetCurrentSurface,"$q":_eglGetDisplay,"Kj":_eglGetError,"_q":_eglInitialize,"Pj":_eglMakeCurrent,"gr":_eglQueryString,"Nj":_eglQuerySurface,"kr":_eglSwapBuffers,"jr":_eglSwapInterval,"ar":_eglTerminate,"fr":_emscripten_asm_const_int,"or":_emscripten_get_callstack,"jf":_emscripten_get_canvas_element_size,"Tj":_emscripten_get_device_pixel_ratio,"Sj":_emscripten_get_element_css_size,"mn":_emscripten_get_heap_max,"oh":_emscripten_get_now,"Xq":_emscripten_get_preloaded_image_data,"yq":_emscripten_glActiveTexture,"xq":_emscripten_glAttachShader,"Oq":_emscripten_glBeginQueryEXT,"wq":_emscripten_glBindAttribLocation,"vq":_emscripten_glBindBuffer,"uq":_emscripten_glBindFramebuffer,"tq":_emscripten_glBindRenderbuffer,"sq":_emscripten_glBindTexture,"Gq":_emscripten_glBindVertexArrayOES,"rq":_emscripten_glBlendColor,"pq":_emscripten_glBlendEquation,"oq":_emscripten_glBlendEquationSeparate,"nq":_emscripten_glBlendFunc,"mq":_emscripten_glBlendFuncSeparate,"lq":_emscripten_glBufferData,"kq":_emscripten_glBufferSubData,"jq":_emscripten_glCheckFramebufferStatus,"iq":_emscripten_glClear,"hq":_emscripten_glClearColor,"gq":_emscripten_glClearDepthf,"fq":_emscripten_glClearStencil,"eq":_emscripten_glColorMask,"dq":_emscripten_glCompileShader,"cq":_emscripten_glCompressedTexImage2D,"bq":_emscripten_glCompressedTexSubImage2D,"aq":_emscripten_glCopyTexImage2D,"$p":_emscripten_glCopyTexSubImage2D,"_p":_emscripten_glCreateProgram,"Zp":_emscripten_glCreateShader,"Yp":_emscripten_glCullFace,"Wp":_emscripten_glDeleteBuffers,"Vp":_emscripten_glDeleteFramebuffers,"Up":_emscripten_glDeleteProgram,"Qq":_emscripten_glDeleteQueriesEXT,"Tp":_emscripten_glDeleteRenderbuffers,"Sp":_emscripten_glDeleteShader,"Rp":_emscripten_glDeleteTextures,"Fq":_emscripten_glDeleteVertexArraysOES,"Qp":_emscripten_glDepthFunc,"Pp":_emscripten_glDepthMask,"Op":_emscripten_glDepthRangef,"Np":_emscripten_glDetachShader,"Mp":_emscripten_glDisable,"Lp":_emscripten_glDisableVertexAttribArray,"Kp":_emscripten_glDrawArrays,"Bq":_emscripten_glDrawArraysInstancedANGLE,"Cq":_emscripten_glDrawBuffersWEBGL,"Jp":_emscripten_glDrawElements,"Aq":_emscripten_glDrawElementsInstancedANGLE,"Ip":_emscripten_glEnable,"Hp":_emscripten_glEnableVertexAttribArray,"Nq":_emscripten_glEndQueryEXT,"Gp":_emscripten_glFinish,"Fp":_emscripten_glFlush,"Ep":_emscripten_glFramebufferRenderbuffer,"Dp":_emscripten_glFramebufferTexture2D,"Cp":_emscripten_glFrontFace,"Bp":_emscripten_glGenBuffers,"zp":_emscripten_glGenFramebuffers,"Rq":_emscripten_glGenQueriesEXT,"yp":_emscripten_glGenRenderbuffers,"xp":_emscripten_glGenTextures,"Eq":_emscripten_glGenVertexArraysOES,"Ap":_emscripten_glGenerateMipmap,"wp":_emscripten_glGetActiveAttrib,"vp":_emscripten_glGetActiveUniform,"up":_emscripten_glGetAttachedShaders,"tp":_emscripten_glGetAttribLocation,"sp":_emscripten_glGetBooleanv,"rp":_emscripten_glGetBufferParameteriv,"qp":_emscripten_glGetError,"pp":_emscripten_glGetFloatv,"op":_emscripten_glGetFramebufferAttachmentParameteriv,"np":_emscripten_glGetIntegerv,"lp":_emscripten_glGetProgramInfoLog,"mp":_emscripten_glGetProgramiv,"Iq":_emscripten_glGetQueryObjecti64vEXT,"Kq":_emscripten_glGetQueryObjectivEXT,"Hq":_emscripten_glGetQueryObjectui64vEXT,"Jq":_emscripten_glGetQueryObjectuivEXT,"Lq":_emscripten_glGetQueryivEXT,"kp":_emscripten_glGetRenderbufferParameteriv,"ip":_emscripten_glGetShaderInfoLog,"hp":_emscripten_glGetShaderPrecisionFormat,"gp":_emscripten_glGetShaderSource,"jp":_emscripten_glGetShaderiv,"fp":_emscripten_glGetString,"ep":_emscripten_glGetTexParameterfv,"dp":_emscripten_glGetTexParameteriv,"ap":_emscripten_glGetUniformLocation,"cp":_emscripten_glGetUniformfv,"bp":_emscripten_glGetUniformiv,"Yo":_emscripten_glGetVertexAttribPointerv,"$o":_emscripten_glGetVertexAttribfv,"Zo":_emscripten_glGetVertexAttribiv,"Xo":_emscripten_glHint,"Wo":_emscripten_glIsBuffer,"Vo":_emscripten_glIsEnabled,"Uo":_emscripten_glIsFramebuffer,"To":_emscripten_glIsProgram,"Pq":_emscripten_glIsQueryEXT,"So":_emscripten_glIsRenderbuffer,"Ro":_emscripten_glIsShader,"Qo":_emscripten_glIsTexture,"Dq":_emscripten_glIsVertexArrayOES,"Oo":_emscripten_glLineWidth,"No":_emscripten_glLinkProgram,"Mo":_emscripten_glPixelStorei,"Lo":_emscripten_glPolygonOffset,"Mq":_emscripten_glQueryCounterEXT,"Ko":_emscripten_glReadPixels,"Jo":_emscripten_glReleaseShaderCompiler,"Io":_emscripten_glRenderbufferStorage,"Ho":_emscripten_glSampleCoverage,"Go":_emscripten_glScissor,"Fo":_emscripten_glShaderBinary,"Eo":_emscripten_glShaderSource,"Do":_emscripten_glStencilFunc,"Co":_emscripten_glStencilFuncSeparate,"Bo":_emscripten_glStencilMask,"Ao":_emscripten_glStencilMaskSeparate,"zo":_emscripten_glStencilOp,"yo":_emscripten_glStencilOpSeparate,"xo":_emscripten_glTexImage2D,"wo":_emscripten_glTexParameterf,"vo":_emscripten_glTexParameterfv,"uo":_emscripten_glTexParameteri,"to":_emscripten_glTexParameteriv,"so":_emscripten_glTexSubImage2D,"ro":_emscripten_glUniform1f,"qo":_emscripten_glUniform1fv,"po":_emscripten_glUniform1i,"oo":_emscripten_glUniform1iv,"no":_emscripten_glUniform2f,"mo":_emscripten_glUniform2fv,"lo":_emscripten_glUniform2i,"ko":_emscripten_glUniform2iv,"jo":_emscripten_glUniform3f,"io":_emscripten_glUniform3fv,"ho":_emscripten_glUniform3i,"go":_emscripten_glUniform3iv,"fo":_emscripten_glUniform4f,"eo":_emscripten_glUniform4fv,"co":_emscripten_glUniform4i,"bo":_emscripten_glUniform4iv,"ao":_emscripten_glUniformMatrix2fv,"_n":_emscripten_glUniformMatrix3fv,"Zn":_emscripten_glUniformMatrix4fv,"Yn":_emscripten_glUseProgram,"Xn":_emscripten_glValidateProgram,"Wn":_emscripten_glVertexAttrib1f,"Vn":_emscripten_glVertexAttrib1fv,"Un":_emscripten_glVertexAttrib2f,"Tn":_emscripten_glVertexAttrib2fv,"Sn":_emscripten_glVertexAttrib3f,"Rn":_emscripten_glVertexAttrib3fv,"Pn":_emscripten_glVertexAttrib4f,"On":_emscripten_glVertexAttrib4fv,"zq":_emscripten_glVertexAttribDivisorANGLE,"Nn":_emscripten_glVertexAttribPointer,"Mn":_emscripten_glViewport,"Bn":_emscripten_memcpy_big,"nh":_emscripten_resize_heap,"ng":_emscripten_set_canvas_element_size,"mg":_emscripten_set_element_css_size,"ir":_emscripten_webgl_enable_extension,"hr":_emscripten_webgl_get_context_attributes,"Oj":_emscripten_webgl_get_current_context,"un":_environ_get,"vn":_environ_sizes_get,"Cd":_exit,"jg":_fd_close,"tn":_fd_fdstat_get,"Ej":_fd_read,"Ks":_fd_seek,"Dj":_fd_write,"a":_getTempRet0,"nr":_gethostbyname,"Md":_glActiveTexture,"Wk":_glAttachShader,"yr":_glBindAttribLocation,"Ml":_glBindBuffer,"Vk":_glBindFramebuffer,"Tk":_glBindRenderbuffer,"pm":_glBindTexture,"ol":_glBlendColor,"Hf":_glBlendEquation,"hl":_glBlendEquationSeparate,"Fj":_glBlendFunc,"ll":_glBlendFuncSeparate,"Il":_glBufferData,"Gl":_glBufferSubData,"re":_glCheckFramebufferStatus,"Ac":_glClear,"qq":_glClearColor,"yj":_glClearDepthf,"Vm":_glClearStencil,"Xp":_glColorMask,"di":_glCompileShader,"Tl":_glCompressedTexImage2D,"Pl":_glCompressedTexSubImage2D,"cm":_glCopyTexImage2D,"_l":_glCopyTexSubImage2D,"$h":_glCreateProgram,"Xh":_glCreateShader,"sh":_glCullFace,"Al":_glDeleteBuffers,"Dk":_glDeleteFramebuffers,"Th":_glDeleteProgram,"vk":_glDeleteRenderbuffers,"Nh":_glDeleteShader,"tm":_glDeleteTextures,"ed":_glDepthFunc,"zc":_glDepthMask,"vj":_glDepthRangef,"vt":_glDetachShader,"ub":_glDisable,"Gh":_glDisableVertexAttribArray,"kh":_glDrawArrays,"fg":_glDrawElements,"Kb":_glEnable,"Fh":_glEnableVertexAttribArray,"Bj":_glFinish,"Aj":_glFlush,"lt":_glFramebufferRenderbuffer,"dt":_glFramebufferTexture2D,"rh":_glFrontFace,"yl":_glGenBuffers,"Xs":_glGenFramebuffers,"Qs":_glGenRenderbuffers,"wm":_glGenTextures,"$s":_glGenerateMipmap,"xr":_glGetActiveAttrib,"vr":_glGetActiveUniform,"Ms":_glGetAttachedShaders,"ur":_glGetAttribLocation,"$n":_glGetBooleanv,"vl":_glGetBufferParameteriv,"ic":_glGetError,"Qn":_glGetFloatv,"Es":_glGetFramebufferAttachmentParameteriv,"Sc":_glGetIntegerv,"tr":_glGetProgramInfoLog,"ss":_glGetProgramiv,"rs":_glGetRenderbufferParameteriv,"sr":_glGetShaderInfoLog,"Vj":_glGetShaderPrecisionFormat,"rr":_glGetShaderSource,"qs":_glGetShaderiv,"le":_glGetString,"Gm":_glGetTexParameterfv,"Em":_glGetTexParameteriv,"qr":_glGetUniformLocation,"ps":_glGetUniformfv,"os":_glGetUniformiv,"ls":_glGetVertexAttribPointerv,"ns":_glGetVertexAttribfv,"ms":_glGetVertexAttribiv,"jn":_glHint,"tl":_glIsBuffer,"kg":_glIsEnabled,"ks":_glIsFramebuffer,"js":_glIsProgram,"is":_glIsRenderbuffer,"hs":_glIsShader,"lm":_glIsTexture,"lg":_glLineWidth,"Uj":_glLinkProgram,"cn":_glPixelStorei,"_o":_glPolygonOffset,"bn":_glReadPixels,"gs":_glReleaseShaderCompiler,"fs":_glRenderbufferStorage,"ql":_glSampleCoverage,"Po":_glScissor,"es":_glShaderBinary,"ds":_glShaderSource,"hf":_glStencilFunc,"$k":_glStencilFuncSeparate,"$m":_glStencilMask,"Yk":_glStencilMaskSeparate,"fh":_glStencilOp,"el":_glStencilOpSeparate,"zm":_glTexImage2D,"Tm":_glTexParameterf,"Km":_glTexParameterfv,"Pm":_glTexParameteri,"Hm":_glTexParameteriv,"gm":_glTexSubImage2D,"cs":_glUniform1f,"bs":_glUniform1fv,"$r":_glUniform1i,"_r":_glUniform1iv,"Zr":_glUniform2f,"Yr":_glUniform2fv,"Xr":_glUniform2i,"Wr":_glUniform2iv,"Vr":_glUniform3f,"Ur":_glUniform3fv,"Tr":_glUniform3i,"Sr":_glUniform3iv,"Qr":_glUniform4f,"Pr":_glUniform4fv,"Or":_glUniform4i,"Nr":_glUniform4iv,"Mr":_glUniformMatrix2fv,"Lr":_glUniformMatrix3fv,"Kr":_glUniformMatrix4fv,"og":_glUseProgram,"Jr":_glValidateProgram,"Ir":_glVertexAttrib1f,"Gr":_glVertexAttrib1fv,"Fr":_glVertexAttrib2f,"Er":_glVertexAttrib2fv,"Dr":_glVertexAttrib3f,"Cr":_glVertexAttrib3fv,"Br":_glVertexAttrib4f,"Ar":_glVertexAttrib4fv,"zr":_glVertexAttribPointer,"fn":_glViewport,"Ji":invoke_d,"X":invoke_dd,"Fa":invoke_ddd,"Bk":invoke_dddiiii,"Za":invoke_ddi,"ft":invoke_ddidd,"Dm":invoke_ddidddi,"pc":invoke_ddii,"ze":invoke_ddiidii,"Si":invoke_ddiidiiddi,"u":invoke_di,"N":invoke_did,"lc":invoke_didd,"Bc":invoke_diddd,"ni":invoke_didddddidi,"yf":invoke_didddidi,"gk":invoke_diddi,"Bh":invoke_diddiii,"ac":invoke_didi,"Ts":invoke_dididd,"yh":invoke_didii,"jd":invoke_didiii,"Ue":invoke_didiiii,"Lh":invoke_didiiiiidi,"y":invoke_dii,"Aa":invoke_diid,"_b":invoke_diidd,"Ra":invoke_diiddd,"mi":invoke_diiddi,"dd":invoke_diidi,"Yc":invoke_diidii,"id":invoke_diidiiddi,"Kl":invoke_diidiidii,"Jl":invoke_diidiidiiddi,"Mb":invoke_diidiii,"wk":invoke_diidiiii,"$":invoke_diii,"ie":invoke_diiid,"Qh":invoke_diiiddi,"Um":invoke_diiidi,"Ng":invoke_diiidii,"uk":invoke_diiidiiii,"ab":invoke_diiii,"Oh":invoke_diiiid,"Zc":invoke_diiiidd,"Ri":invoke_diiiidii,"Hl":invoke_diiiidiiddi,"Qi":invoke_diiiidiii,"fc":invoke_diiiii,"Uc":invoke_diiiiidiiii,"sf":invoke_diiiiii,"fk":invoke_diiiiiii,"en":invoke_fi,"n":invoke_i,"bt":invoke_iddddidddd,"ct":invoke_iddddiddi,"qm":invoke_iddddiid,"km":invoke_iddddiii,"kf":invoke_idddii,"Ah":invoke_iddiddiiiii,"ik":invoke_iddii,"ti":invoke_iddiidii,"rd":invoke_iddiii,"Vc":invoke_iddiiiiii,"oe":invoke_idi,"nl":invoke_ididi,"_j":invoke_ididiiii,"pb":invoke_idii,"kc":invoke_idiid,"Ym":invoke_idiiddii,"qf":invoke_idiiid,"Zj":invoke_idiiididii,"uj":invoke_idiiii,"Ni":invoke_idiiiiii,"Im":invoke_idiiiiiid,"f":invoke_ii,"O":invoke_iid,"T":invoke_iidd,"ka":invoke_iiddd,"Bb":invoke_iidddd,"he":invoke_iiddddd,"sl":invoke_iidddddd,"pj":invoke_iiddddddd,"ui":invoke_iidddddddd,"Be":invoke_iiddddddddiii,"Jg":invoke_iiddddi,"_h":invoke_iiddddii,"nb":invoke_iidddi,"tk":invoke_iidddid,"hg":invoke_iidddidd,"Fl":invoke_iidddidiiiii,"Fk":invoke_iidddii,"Ad":invoke_iidddiii,"nm":invoke_iidddiiii,"bi":invoke_iidddiiiiii,"ci":invoke_iidddiiiiiiiii,"Pk":invoke_iidddiiiiiiiiii,"cb":invoke_iiddi,"_e":invoke_iiddiddidii,"zk":invoke_iiddididdi,"db":invoke_iiddii,"cj":invoke_iiddiiddd,"Ch":invoke_iiddiii,"qt":invoke_iiddiiid,"dm":invoke_iiddiiii,"Te":invoke_iiddiiiii,"Sm":invoke_iiddiiiiii,"Ti":invoke_iiddiiiiiiiiii,"Nl":invoke_iidfdf,"ha":invoke_iidi,"ye":invoke_iidid,"df":invoke_iididd,"Xl":invoke_iididdi,"Vs":invoke_iididdii,"Hk":invoke_iididi,"Cg":invoke_iididiii,"fm":invoke_iididiiiiidd,"wa":invoke_iidii,"Xb":invoke_iidiid,"Qk":invoke_iidiiddiid,"Ya":invoke_iidiii,"qc":invoke_iidiiii,"Me":invoke_iidiiiidiiiiii,"tg":invoke_iidiiiii,"Qe":invoke_iidiiiiii,"Se":invoke_iidiiiiiii,"qe":invoke_iidiiiiiiiii,"jt":invoke_iidiiiiiiiiiiiii,"Ha":invoke_iif,"pd":invoke_iifff,"eg":invoke_iiffff,"c":invoke_iii,"F":invoke_iiid,"S":invoke_iiidd,"bb":invoke_iiiddd,"Sa":invoke_iiidddd,"Ud":invoke_iiiddddd,"ib":invoke_iiidddddd,"Dl":invoke_iiiddddddd,"Ug":invoke_iiidddddddddd,"ej":invoke_iiiddddddddiii,"Og":invoke_iiidddddddii,"oj":invoke_iiidddddi,"Zf":invoke_iiidddddiii,"Fb":invoke_iiiddddi,"sj":invoke_iiiddddid,"af":invoke_iiiddddidd,"Ps":invoke_iiiddddidii,"Ga":invoke_iiiddddii,"Sf":invoke_iiiddddiii,"_m":invoke_iiiddddiiid,"od":invoke_iiidddi,"eh":invoke_iiidddid,"Oc":invoke_iiidddiid,"tj":invoke_iiidddiii,"om":invoke_iiidddiiii,"Oe":invoke_iiidddiiiii,"ya":invoke_iiiddi,"sb":invoke_iiiddid,"Nd":invoke_iiiddidd,"vc":invoke_iiiddidddd,"Ul":invoke_iiiddiddiddddddd,"ge":invoke_iiiddidi,"L":invoke_iiiddii,"Ag":invoke_iiiddiidd,"Of":invoke_iiiddiii,"Rl":invoke_iiiddiiid,"Rf":invoke_iiiddiiii,"Xj":invoke_iiiddiiiii,"bl":invoke_iiiddiiiiiii,"Ll":invoke_iiiddiiiiiiiiii,"K":invoke_iiidi,"mb":invoke_iiidid,"Yl":invoke_iiididdi,"De":invoke_iiididdii,"hh":invoke_iiididi,"Vl":invoke_iiidididddddddd,"va":invoke_iiidii,"Xf":invoke_iiidiidiid,"ht":invoke_iiidiidiiiiii,"Da":invoke_iiidiii,"Vf":invoke_iiidiiid,"xm":invoke_iiidiiidd,"ad":invoke_iiidiiii,"Rh":invoke_iiidiiiid,"Ed":invoke_iiidiiiidd,"Hd":invoke_iiidiiiii,"_c":invoke_iiidiiiiii,"it":invoke_iiidiiiiiiii,"_k":invoke_iiidiiiiiiiiii,"j":invoke_iiii,"J":invoke_iiiid,"ea":invoke_iiiidd,"Ja":invoke_iiiiddd,"ob":invoke_iiiidddd,"Rm":invoke_iiiiddddd,"Nc":invoke_iiiidddddd,"gf":invoke_iiiidddddddd,"cg":invoke_iiiidddddddddd,"nj":invoke_iiiiddddddii,"Zm":invoke_iiiidddddi,"an":invoke_iiiidddddid,"zd":invoke_iiiiddddi,"Le":invoke_iiiiddddidd,"Tb":invoke_iiiidddi,"El":invoke_iiiidddid,"rt":invoke_iiiidddii,"xk":invoke_iiiidddiiii,"Zl":invoke_iiiidddiiiii,"gc":invoke_iiiiddi,"Mm":invoke_iiiiddid,"$g":invoke_iiiiddiddiiii,"fb":invoke_iiiiddii,"Mg":invoke_iiiiddiidi,"fe":invoke_iiiiddiii,"Qb":invoke_iiiiddiiii,"Ba":invoke_iiiidi,"Od":invoke_iiiidid,"Bm":invoke_iiiididdii,"Qf":invoke_iiiididi,"hm":invoke_iiiididiiiiidd,"cc":invoke_iiiidii,"Xa":invoke_iiiidiii,"Wf":invoke_iiiidiiid,"Xi":invoke_iiiidiiiddddddd,"mm":invoke_iiiidiiii,"Pi":invoke_iiiidiiiii,"Id":invoke_iiiif,"s":invoke_iiiii,"ca":invoke_iiiiid,"Wa":invoke_iiiiidd,"Eb":invoke_iiiiiddd,"wb":invoke_iiiiidddd,"gi":invoke_iiiiiddddi,"Vg":invoke_iiiiidddi,"ec":invoke_iiiiiddi,"Cm":invoke_iiiiiddiddiiii,"ne":invoke_iiiiiddidi,"dc":invoke_iiiiiddii,"ck":invoke_iiiiiddiiddiii,"ak":invoke_iiiiiddiiddiiii,"dk":invoke_iiiiiddiididii,"sg":invoke_iiiiiddiidiii,"Yb":invoke_iiiiiddiii,"je":invoke_iiiiiddiiii,"vm":invoke_iiiiiddiiiiii,"hj":invoke_iiiiiddiiiiiii,"Pb":invoke_iiiiidi,"zb":invoke_iiiiididi,"$e":invoke_iiiiidii,"ef":invoke_iiiiidiii,"Pf":invoke_iiiiidiiidi,"ri":invoke_iiiiidiiiiii,"z":invoke_iiiiii,"la":invoke_iiiiiid,"La":invoke_iiiiiidd,"gh":invoke_iiiiiidddd,"Om":invoke_iiiiiidddddddddd,"Nm":invoke_iiiiiiddddddii,"jh":invoke_iiiiiiddddii,"jm":invoke_iiiiiidddi,"dg":invoke_iiiiiiddi,"_g":invoke_iiiiiiddiddiiiii,"Fe":invoke_iiiiiiddii,"Wd":invoke_iiiiiiddiiddiii,"He":invoke_iiiiiiddiii,"Kf":invoke_iiiiiiddiiii,"pg":invoke_iiiiiiddiiiii,"ud":invoke_iiiiiidi,"ag":invoke_iiiiiidii,"Wl":invoke_iiiiiidiii,"Rk":invoke_iiiiiidiiiii,"w":invoke_iiiiiii,"kb":invoke_iiiiiiid,"dh":invoke_iiiiiiidd,"Ol":invoke_iiiiiiidddd,"Qm":invoke_iiiiiiidddddddd,"im":invoke_iiiiiiidddi,"qj":invoke_iiiiiiiddi,"Am":invoke_iiiiiiiddiddiiiii,"Zg":invoke_iiiiiiiddiddiiiiii,"Zs":invoke_iiiiiiiddii,"bk":invoke_iiiiiiiddiii,"kt":invoke_iiiiiiiddiiiiii,"Yf":invoke_iiiiiiidi,"_s":invoke_iiiiiiidii,"D":invoke_iiiiiiii,"Nf":invoke_iiiiiiiid,"Zk":invoke_iiiiiiiidd,"ue":invoke_iiiiiiiidddddddddiiddii,"Dh":invoke_iiiiiiiidddddiiidddd,"Dc":invoke_iiiiiiiiddi,"Vi":invoke_iiiiiiiiddidddd,"ym":invoke_iiiiiiiiddiddiiiiii,"xc":invoke_iiiiiiiiddii,"rg":invoke_iiiiiiiiddiii,"Ce":invoke_iiiiiiiiddiiii,"ld":invoke_iiiiiiiiddiiiii,"Ui":invoke_iiiiiiiididd,"dn":invoke_iiiiiiiidii,"Oi":invoke_iiiiiiiidiii,"$f":invoke_iiiiiiiifiii,"da":invoke_iiiiiiiii,"rb":invoke_iiiiiiiiid,"yd":invoke_iiiiiiiiidddd,"rj":invoke_iiiiiiiiiddddii,"ut":invoke_iiiiiiiiiddiiii,"Qd":invoke_iiiiiiiiidi,"wg":invoke_iiiiiiiiidiii,"xg":invoke_iiiiiiiiidiiii,"Ia":invoke_iiiiiiiiii,"zf":invoke_iiiiiiiiiid,"Wm":invoke_iiiiiiiiiidddd,"Xm":invoke_iiiiiiiiiiddddii,"Tg":invoke_iiiiiiiiiidddiiiiiiiiii,"ih":invoke_iiiiiiiiiiddi,"Ge":invoke_iiiiiiiiiiddidd,"ok":invoke_iiiiiiiiiidiiiiiiiiii,"Na":invoke_iiiiiiiiiii,"me":invoke_iiiiiiiiiiiddddiiiiiiiii,"Sh":invoke_iiiiiiiiiiiddddiiiiiiiiii,"yg":invoke_iiiiiiiiiiiddddiiiiiiiiiii,"am":invoke_iiiiiiiiiiidddiiiiiiiiii,"Td":invoke_iiiiiiiiiiidi,"Va":invoke_iiiiiiiiiiii,"se":invoke_iiiiiiiiiiiid,"Yd":invoke_iiiiiiiiiiiiddddiiiiiiiiiiiiii,"Jd":invoke_iiiiiiiiiiiiddiiiiii,"cd":invoke_iiiiiiiiiiiii,"Ki":invoke_iiiiiiiiiiiiid,"Mc":invoke_iiiiiiiiiiiiii,"Lf":invoke_iiiiiiiiiiiiiid,"nf":invoke_iiiiiiiiiiiiiiddddiiiiiiiii,"Ih":invoke_iiiiiiiiiiiiiiddi,"Di":invoke_iiiiiiiiiiiiiii,"mf":invoke_iiiiiiiiiiiiiiiddddiiiiiiiii,"qd":invoke_iiiiiiiiiiiiiiii,"Kh":invoke_iiiiiiiiiiiiiiiiiddddiiiiiiiiii,"Fi":invoke_iiiiiiiiiiiiiiiiidddiiiiiiiii,"fd":invoke_iiiiiiiiiiiiiiiiii,"Jh":invoke_iiiiiiiiiiiiiiiiiiddddiiiiiiiiii,"vg":invoke_iiiiiiiiiiiiiiiiiiii,"Zi":invoke_iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii,"us":invoke_iiiiij,"Is":invoke_iiij,"Hs":invoke_iiijj,"ws":invoke_iij,"Fs":invoke_iiji,"Js":invoke_iijii,"zs":invoke_ji,"C":invoke_v,"Xd":invoke_vddddddi,"Je":invoke_vdddddi,"Ze":invoke_vddddiiiiiiiiiiii,"em":invoke_vdddii,"kd":invoke_vdddiii,"Zh":invoke_vdddiiii,"bh":invoke_vdddiiiiiiiii,"Ta":invoke_vddi,"Wb":invoke_vddii,"Wj":invoke_vddiii,"Jb":invoke_vddiiii,"Ak":invoke_vddiiiiii,"Kc":invoke_vddiiiiiii,"Jk":invoke_vddiiiiiiii,"fj":invoke_vddiiiiiiiiiiii,"sm":invoke_vddiiiiiiiiiiiiii,"Mi":invoke_vddiiiiiiiiiiiiiii,"Wi":invoke_vddiiiiiiiiiiiiiiii,"Ae":invoke_vddiiiiiiiiiiiiiiiii,"be":invoke_vddiiiiiiiiiiiiiiiiiiii,"Li":invoke_vddiiiiiiiiiiiiiiiiiiiiiiii,"Ic":invoke_vdi,"Lb":invoke_vdiddddi,"Ld":invoke_vdiddiiiiii,"Eh":invoke_vdidiii,"Vd":invoke_vdii,"ah":invoke_vdiidiiiiiiii,"Af":invoke_vdiii,"lj":invoke_vdiiidiiiiiiii,"Ob":invoke_vdiiii,"Rd":invoke_vdiiiii,"Jm":invoke_vdiiiiii,"Sb":invoke_vdiiiiiiii,"Ab":invoke_vdiiiiiiiii,"bd":invoke_vdiiiiiiiiii,"ch":invoke_vdiiiiiiiiiii,"Kk":invoke_vdiiiiiiiiiiiiii,"l":invoke_vi,"H":invoke_vid,"ja":invoke_vidd,"Oa":invoke_viddd,"yb":invoke_vidddd,"ml":invoke_viddddd,"Ib":invoke_vidddddd,"Hg":invoke_viddddddd,"Fd":invoke_vidddddddddddd,"wf":invoke_vidddddddii,"Bg":invoke_viddddddiii,"te":invoke_vidddddi,"gg":invoke_vidddddiii,"Rs":invoke_viddddi,"Jc":invoke_viddddii,"uf":invoke_viddddiid,"yc":invoke_viddddiii,"Hh":invoke_viddddiiii,"mt":invoke_viddddiiiii,"tb":invoke_vidddi,"ae":invoke_vidddidddddd,"$c":invoke_vidddii,"de":invoke_vidddiii,"Zd":invoke_vidddiiidi,"ia":invoke_viddi,"Hi":invoke_viddidddiii,"jb":invoke_viddii,"Yh":invoke_viddiiddi,"Wh":invoke_viddiiddiii,"Yj":invoke_viddiididiiiiiiiiiiiiiiiiiii,"Y":invoke_viddiii,"nd":invoke_viddiiii,"Gb":invoke_viddiiiiii,"gn":invoke_viddiiiiiiiii,"Pe":invoke_viddiiiiiiiiii,"If":invoke_vidfdfii,"E":invoke_vidi,"al":invoke_vidid,"Zb":invoke_vididi,"M":invoke_vidii,"wj":invoke_vidiidiii,"ga":invoke_vidiii,"Ik":invoke_vidiiiddii,"gd":invoke_vidiiidi,"rc":invoke_vidiiii,"eb":invoke_vidiiiii,"Sk":invoke_vidiiiiidd,"oc":invoke_vidiiiiii,"mj":invoke_vidiiiiiiiiiii,"hc":invoke_vif,"zg":invoke_viffff,"g":invoke_vii,"x":invoke_viid,"I":invoke_viidd,"ba":invoke_viiddd,"Ua":invoke_viidddd,"sc":invoke_viiddddd,"Ka":invoke_viidddddd,"Ve":invoke_viidddddddd,"uc":invoke_viidddddddiiii,"zh":invoke_viidddddi,"Ie":invoke_viidddddiii,"Rb":invoke_viiddddi,"we":invoke_viiddddidd,"ke":invoke_viiddddiii,"gl":invoke_viiddddiiid,"Vb":invoke_viidddi,"lf":invoke_viidddidi,"Xg":invoke_viidddii,"$d":invoke_viidddiid,"md":invoke_viidddiii,"Os":invoke_viidddiiii,"aa":invoke_viiddi,"Ss":invoke_viiddid,"mk":invoke_viiddidd,"Lm":invoke_viiddiddddi,"Ph":invoke_viiddidi,"qa":invoke_viiddii,"Ek":invoke_viiddiidiiiiii,"Rc":invoke_viiddiii,"gt":invoke_viiddiiid,"si":invoke_viiddiiiddii,"ee":invoke_viiddiiii,"sk":invoke_viiddiiiiiiddiii,"Gc":invoke_viiddiiiiiiii,"hn":invoke_viiddiiiiiiiii,"ma":invoke_viidi,"ta":invoke_viidid,"xe":invoke_viididd,"pt":invoke_viididdi,"Ke":invoke_viididi,"na":invoke_viidii,"Kg":invoke_viidiid,"xj":invoke_viidiidiii,"hb":invoke_viidiii,"Kd":invoke_viidiiid,"fi":invoke_viidiiidddii,"Dd":invoke_viidiiidii,"vd":invoke_viidiiii,"Ub":invoke_viidiiiii,"of":invoke_viidiiiiidiii,"wd":invoke_viidiiiiii,"um":invoke_viidiiiiiii,"cf":invoke_viidiiiiiiiiiiii,"Wg":invoke_viidiiiiiiiiiiiii,"tc":invoke_viif,"rl":invoke_viifff,"Ck":invoke_viifi,"Uh":invoke_viifiii,"h":invoke_viii,"G":invoke_viiid,"Z":invoke_viiidd,"Nb":invoke_viiiddd,"_a":invoke_viiidddd,"vi":invoke_viiidddddd,"il":invoke_viiidddddddd,"fl":invoke_viiiddddddi,"jl":invoke_viiidddddi,"Ee":invoke_viiiddddi,"pk":invoke_viiiddddiddi,"ji":invoke_viiiddddii,"ff":invoke_viiidddi,"Yi":invoke_viiidddidi,"zl":invoke_viiidddii,"Xk":invoke_viiidddiii,"$a":invoke_viiiddi,"ii":invoke_viiiddid,"Wc":invoke_viiiddidi,"Ys":invoke_viiiddidiii,"ki":invoke_viiiddidiiiii,"Lc":invoke_viiiddii,"Ns":invoke_viiiddiii,"Pd":invoke_viiiddiiii,"Ec":invoke_viiiddiiiii,"Ql":invoke_viiiddiiiiii,"gj":invoke_viiiddiiiiiiiiiiiiii,"sa":invoke_viiidi,"vb":invoke_viiidid,"lk":invoke_viiididi,"xa":invoke_viiidii,"_d":invoke_viiidiid,"Hb":invoke_viiidiii,"dl":invoke_viiidiiii,"Uk":invoke_viiidiiiiddiiiiii,"Sd":invoke_viiidiiiii,"Rg":invoke_viiidiiiiii,"ai":invoke_viiidiiiiiid,"li":invoke_viiidiiiiiiiiii,"_f":invoke_viiifiii,"dj":invoke_viiifiiiii,"o":invoke_viiii,"U":invoke_viiiid,"Ea":invoke_viiiidd,"We":invoke_viiiidddd,"Gg":invoke_viiiiddddd,"Fg":invoke_viiiidddddd,"Yg":invoke_viiiidddi,"ei":invoke_viiiidddii,"kk":invoke_viiiidddiiiii,"bf":invoke_viiiiddi,"bg":invoke_viiiiddii,"hk":invoke_viiiiddiii,"pl":invoke_viiiiddiiid,"Fm":invoke_viiiiddiiii,"zj":invoke_viiiiddiiiii,"ra":invoke_viiiidi,"st":invoke_viiiidid,"ot":invoke_viiiididi,"lb":invoke_viiiidii,"Fc":invoke_viiiidiidi,"Db":invoke_viiiidiii,"jk":invoke_viiiidiiidi,"Re":invoke_viiiidiiii,"Mh":invoke_viiiidiiiiiidiiiiiiiiiii,"ij":invoke_viiiifiii,"v":invoke_viiiii,"fa":invoke_viiiiid,"Ca":invoke_viiiiidd,"Hc":invoke_viiiiiddd,"Xc":invoke_viiiiidddd,"Gk":invoke_viiiiidddddd,"cl":invoke_viiiiidddddddd,"Xe":invoke_viiiiiddddi,"rk":invoke_viiiiiddddiddi,"Tc":invoke_viiiiidddii,"mc":invoke_viiiiiddi,"Sg":invoke_viiiiiddii,"Ye":invoke_viiiiiddiii,"qi":invoke_viiiiiddiiii,"nk":invoke_viiiiiddiiiiii,"qb":invoke_viiiiidi,"Pc":invoke_viiiiidii,"ce":invoke_viiiiidiii,"A":invoke_viiiiii,"gb":invoke_viiiiiid,"Jf":invoke_viiiiiidd,"vf":invoke_viiiiiiddddidd,"qk":invoke_viiiiiiddddiddi,"oi":invoke_viiiiiidddi,"rm":invoke_viiiiiidddiii,"Gd":invoke_viiiiiiddi,"qg":invoke_viiiiiiddidiiiiii,"Sl":invoke_viiiiiiddii,"hi":invoke_viiiiiiddiii,"et":invoke_viiiiiiddiiii,"xd":invoke_viiiiiidi,"Eg":invoke_viiiiiididi,"Ne":invoke_viiiiiidii,"Bf":invoke_viiiiiidiidid,"Cc":invoke_viiiiiidiii,"B":invoke_viiiiiii,"rf":invoke_viiiiiiid,"pi":invoke_viiiiiiidddd,"Ii":invoke_viiiiiiiddddiiii,"Nk":invoke_viiiiiiiddii,"Ok":invoke_viiiiiiiddiiii,"pf":invoke_viiiiiiidii,"ug":invoke_viiiiiiidiiii,"xh":invoke_viiiiiiidiiiidiii,"Vh":invoke_viiiiiiif,"_":invoke_viiiiiiii,"ve":invoke_viiiiiiiid,"Ei":invoke_viiiiiiiidd,"Ai":invoke_viiiiiiiiddddd,"yi":invoke_viiiiiiiidddddidid,"Ig":invoke_viiiiiiiiddi,"pe":invoke_viiiiiiiidi,"Df":invoke_viiiiiiiididid,"Us":invoke_viiiiiiiidii,"Bl":invoke_viiiiiiiidiii,"ua":invoke_viiiiiiiii,"Qc":invoke_viiiiiiiiid,"Gi":invoke_viiiiiiiiidd,"Cb":invoke_viiiiiiiiiddi,"yk":invoke_viiiiiiiiidii,"Cl":invoke_viiiiiiiiidiii,"oa":invoke_viiiiiiiiii,"nt":invoke_viiiiiiiiiid,"Lk":invoke_viiiiiiiiiidddiii,"Mk":invoke_viiiiiiiiiidddiiiiii,"Dg":invoke_viiiiiiiiiiddi,"ul":invoke_viiiiiiiiiidfdf,"Ma":invoke_viiiiiiiiiii,"lh":invoke_viiiiiiiiiiid,"hd":invoke_viiiiiiiiiiidi,"Ci":invoke_viiiiiiiiiiidididididid,"Cf":invoke_viiiiiiiiiiidiii,"xb":invoke_viiiiiiiiiiii,"nc":invoke_viiiiiiiiiiiidi,"Bi":invoke_viiiiiiiiiiiidididididid,"Qg":invoke_viiiiiiiiiiiidii,"bc":invoke_viiiiiiiiiiiii,"Mf":invoke_viiiiiiiiiiiiidi,"$b":invoke_viiiiiiiiiiiiii,"tf":invoke_viiiiiiiiiiiiiidddd,"Uf":invoke_viiiiiiiiiiiiiidddiiiiiiiii,"Tf":invoke_viiiiiiiiiiiiiiddiiiiiiiii,"xi":invoke_viiiiiiiiiiiiiidid,"sd":invoke_viiiiiiiiiiiiiii,"Lg":invoke_viiiiiiiiiiiiiiid,"aj":invoke_viiiiiiiiiiiiiiidddiiiiiiiii,"_i":invoke_viiiiiiiiiiiiiiiddiiiiiiiii,"Gf":invoke_viiiiiiiiiiiiiiidid,"Ef":invoke_viiiiiiiiiiiiiiidididid,"zi":invoke_viiiiiiiiiiiiiiididididid,"Ff":invoke_viiiiiiiiiiiiiiidididididid,"kl":invoke_viiiiiiiiiiiiiiidididididididididididid,"Pg":invoke_viiiiiiiiiiiiiiii,"tt":invoke_viiiiiiiiiiiiiiiiiddiiiiiiiiiii,"bj":invoke_viiiiiiiiiiiiiiiiiiidddiiiiiiiiii,"$i":invoke_viiiiiiiiiiiiiiiiiiiddiiiiiiiiii,"wi":invoke_viiiiiiiiiiiiiiiiiiii,"bm":invoke_viiiiiiiiiiiiiiiiiiiidddiiiiiiiiii,"$l":invoke_viiiiiiiiiiiiiiiiiiiiddiiiiiiiiii,"jj":invoke_viiiiiiiiiiiiiiiiiiiiii,"kj":invoke_viiiiiiiiiiiiiiiiiiiiiii,"Ws":invoke_viiiiiiiiiiiiiiiiiiiiiiii,"at":invoke_viiiiiiiiiiiiiiiiiiiiiiiii,"$j":invoke_viiiiiiiiiiiiiiiiiiiiiiiiii,"ek":invoke_viiiiiiiiiiiiiiiiiiiiiiiiiii,"xl":invoke_viiiiiiiiiiiiiiiiiiiiiiiiiiii,"wl":invoke_viiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii,"As":invoke_viiiij,"Gs":invoke_viiiiji,"xs":invoke_viiijj,"ys":invoke_viij,"Bs":invoke_viiji,"Cs":invoke_viijii,"vs":invoke_vji,"Ds":invoke_vjj,"W":_llvm_eh_typeid_for,"Wq":occJSConsoleDebug,"Ij":occJSConsoleError,"Vq":occJSConsoleInfo,"Jj":occJSConsoleWarn,"ig":_setTempRet0,"vh":_strftime,"wc":_strftime_l};var asm=createWasm();var ___wasm_call_ctors=Module["___wasm_call_ctors"]=function(){return(___wasm_call_ctors=Module["___wasm_call_ctors"]=Module["asm"]["yt"]).apply(null,arguments)};var _malloc=Module["_malloc"]=function(){return(_malloc=Module["_malloc"]=Module["asm"]["zt"]).apply(null,arguments)};var _free=Module["_free"]=function(){return(_free=Module["_free"]=Module["asm"]["At"]).apply(null,arguments)};var ___errno_location=Module["___errno_location"]=function(){return(___errno_location=Module["___errno_location"]=Module["asm"]["Bt"]).apply(null,arguments)};var ___getTypeName=Module["___getTypeName"]=function(){return(___getTypeName=Module["___getTypeName"]=Module["asm"]["Ct"]).apply(null,arguments)};var ___embind_register_native_and_builtin_types=Module["___embind_register_native_and_builtin_types"]=function(){return(___embind_register_native_and_builtin_types=Module["___embind_register_native_and_builtin_types"]=Module["asm"]["Dt"]).apply(null,arguments)};var _htons=Module["_htons"]=function(){return(_htons=Module["_htons"]=Module["asm"]["Ft"]).apply(null,arguments)};var _emscripten_builtin_memalign=Module["_emscripten_builtin_memalign"]=function(){return(_emscripten_builtin_memalign=Module["_emscripten_builtin_memalign"]=Module["asm"]["Gt"]).apply(null,arguments)};var _setThrew=Module["_setThrew"]=function(){return(_setThrew=Module["_setThrew"]=Module["asm"]["Ht"]).apply(null,arguments)};var stackSave=Module["stackSave"]=function(){return(stackSave=Module["stackSave"]=Module["asm"]["It"]).apply(null,arguments)};var stackRestore=Module["stackRestore"]=function(){return(stackRestore=Module["stackRestore"]=Module["asm"]["Jt"]).apply(null,arguments)};var ___cxa_can_catch=Module["___cxa_can_catch"]=function(){return(___cxa_can_catch=Module["___cxa_can_catch"]=Module["asm"]["Kt"]).apply(null,arguments)};var ___cxa_is_pointer_type=Module["___cxa_is_pointer_type"]=function(){return(___cxa_is_pointer_type=Module["___cxa_is_pointer_type"]=Module["asm"]["Lt"]).apply(null,arguments)};var dynCall_iiji=Module["dynCall_iiji"]=function(){return(dynCall_iiji=Module["dynCall_iiji"]=Module["asm"]["Mt"]).apply(null,arguments)};var dynCall_vijii=Module["dynCall_vijii"]=function(){return(dynCall_vijii=Module["dynCall_vijii"]=Module["asm"]["Nt"]).apply(null,arguments)};var dynCall_iijii=Module["dynCall_iijii"]=function(){return(dynCall_iijii=Module["dynCall_iijii"]=Module["asm"]["Ot"]).apply(null,arguments)};var dynCall_viijii=Module["dynCall_viijii"]=function(){return(dynCall_viijii=Module["dynCall_viijii"]=Module["asm"]["Pt"]).apply(null,arguments)};var dynCall_iiiiiji=Module["dynCall_iiiiiji"]=function(){return(dynCall_iiiiiji=Module["dynCall_iiiiiji"]=Module["asm"]["Qt"]).apply(null,arguments)};var dynCall_iiij=Module["dynCall_iiij"]=function(){return(dynCall_iiij=Module["dynCall_iiij"]=Module["asm"]["Rt"]).apply(null,arguments)};var dynCall_ji=Module["dynCall_ji"]=function(){return(dynCall_ji=Module["dynCall_ji"]=Module["asm"]["St"]).apply(null,arguments)};var dynCall_jii=Module["dynCall_jii"]=function(){return(dynCall_jii=Module["dynCall_jii"]=Module["asm"]["Tt"]).apply(null,arguments)};var dynCall_viij=Module["dynCall_viij"]=function(){return(dynCall_viij=Module["dynCall_viij"]=Module["asm"]["Ut"]).apply(null,arguments)};var dynCall_vij=Module["dynCall_vij"]=function(){return(dynCall_vij=Module["dynCall_vij"]=Module["asm"]["Vt"]).apply(null,arguments)};var dynCall_viiji=Module["dynCall_viiji"]=function(){return(dynCall_viiji=Module["dynCall_viiji"]=Module["asm"]["Wt"]).apply(null,arguments)};var dynCall_viiiji=Module["dynCall_viiiji"]=function(){return(dynCall_viiiji=Module["dynCall_viiiji"]=Module["asm"]["Xt"]).apply(null,arguments)};var dynCall_iiijj=Module["dynCall_iiijj"]=function(){return(dynCall_iiijj=Module["dynCall_iiijj"]=Module["asm"]["Yt"]).apply(null,arguments)};var dynCall_iiiiij=Module["dynCall_iiiiij"]=function(){return(dynCall_iiiiij=Module["dynCall_iiiiij"]=Module["asm"]["Zt"]).apply(null,arguments)};var dynCall_viiiij=Module["dynCall_viiiij"]=function(){return(dynCall_viiiij=Module["dynCall_viiiij"]=Module["asm"]["_t"]).apply(null,arguments)};var dynCall_jiii=Module["dynCall_jiii"]=function(){return(dynCall_jiii=Module["dynCall_jiii"]=Module["asm"]["$t"]).apply(null,arguments)};var dynCall_vji=Module["dynCall_vji"]=function(){return(dynCall_vji=Module["dynCall_vji"]=Module["asm"]["au"]).apply(null,arguments)};var dynCall_vijj=Module["dynCall_vijj"]=function(){return(dynCall_vijj=Module["dynCall_vijj"]=Module["asm"]["bu"]).apply(null,arguments)};var dynCall_viijj=Module["dynCall_viijj"]=function(){return(dynCall_viijj=Module["dynCall_viijj"]=Module["asm"]["cu"]).apply(null,arguments)};var dynCall_vjj=Module["dynCall_vjj"]=function(){return(dynCall_vjj=Module["dynCall_vjj"]=Module["asm"]["du"]).apply(null,arguments)};var dynCall_jiji=Module["dynCall_jiji"]=function(){return(dynCall_jiji=Module["dynCall_jiji"]=Module["asm"]["eu"]).apply(null,arguments)};var dynCall_iij=Module["dynCall_iij"]=function(){return(dynCall_iij=Module["dynCall_iij"]=Module["asm"]["fu"]).apply(null,arguments)};var dynCall_viiijj=Module["dynCall_viiijj"]=function(){return(dynCall_viiijj=Module["dynCall_viiijj"]=Module["asm"]["gu"]).apply(null,arguments)};var dynCall_viiiiji=Module["dynCall_viiiiji"]=function(){return(dynCall_viiiiji=Module["dynCall_viiiiji"]=Module["asm"]["hu"]).apply(null,arguments)};var dynCall_iiiiijj=Module["dynCall_iiiiijj"]=function(){return(dynCall_iiiiijj=Module["dynCall_iiiiijj"]=Module["asm"]["iu"]).apply(null,arguments)};var dynCall_iiiiiijj=Module["dynCall_iiiiiijj"]=function(){return(dynCall_iiiiiijj=Module["dynCall_iiiiiijj"]=Module["asm"]["ju"]).apply(null,arguments)};function invoke_iii(index,a1,a2){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vi(index,a1){var sp=stackSave();try{getWasmTableEntry(index)(a1)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vii(index,a1,a2){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_ii(index,a1){var sp=stackSave();try{return getWasmTableEntry(index)(a1)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiddiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiddiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vid(index,a1,a2){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viii(index,a1,a2,a3){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiii(index,a1,a2,a3,a4){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_di(index,a1){var sp=stackSave();try{return getWasmTableEntry(index)(a1)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiii(index,a1,a2,a3){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiidii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiid(index,a1,a2,a3){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiidd(index,a1,a2,a3,a4){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iidddd(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viidi(index,a1,a2,a3,a4){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vidi(index,a1,a2,a3){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiii(index,a1,a2,a3,a4){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiddiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viddiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viidiidiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vidiidiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viidiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vidiiiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiddii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiddddii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viidii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vidii(index,a1,a2,a3,a4){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiddd(index,a1,a2,a3,a4){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiidi(index,a1,a2,a3,a4){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiddii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiddiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viddiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_i(index){var sp=stackSave();try{return getWasmTableEntry(index)()}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiddd(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiid(index,a1,a2,a3,a4){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iidii(index,a1,a2,a3,a4){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iidi(index,a1,a2,a3){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiid(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiidd(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiidd(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiidd(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiidd(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiidd(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiidd(index,a1,a2,a3,a4,a5){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viidd(index,a1,a2,a3,a4){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiddi(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viidiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vidiii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_idiiii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiid(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiddii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viddii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiidiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiddid(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iidddidd(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiidddd(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vdii(index,a1,a2,a3){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiidii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viidddddiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vidddddiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiddddiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viddddiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vidiiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiddi(index,a1,a2,a3,a4){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_fi(index,a1){var sp=stackSave();try{return getWasmTableEntry(index)(a1)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vif(index,a1,a2){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiddi(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiidi(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diii(index,a1,a2,a3){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_dii(index,a1,a2){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiid(index,a1,a2,a3,a4){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viid(index,a1,a2,a3){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viddi(index,a1,a2,a3,a4){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiddi(index,a1,a2,a3,a4,a5){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiidii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiddddii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iid(index,a1,a2){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiddddi(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiddddd(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiidddd(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iidiiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiidddd(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiddd(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iidddi(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiffff(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iif(index,a1,a2){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_v(index){var sp=stackSave();try{getWasmTableEntry(index)()}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiddiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiddiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiddiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiddiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiddi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiiidi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiiddidd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiiddi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiidddi(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiidddiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iidddiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiididi(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiidi(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiidddddid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiddddid(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiidiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiidiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiidii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiidddiid(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiid(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiddddiiid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiidddddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiidddddddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiddddi(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiidddddi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiidddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiid(index,a1,a2,a3,a4,a5){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiddi(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiddi(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_idiiddii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diiid(index,a1,a2,a3,a4){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diid(index,a1,a2,a3){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiiddddii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiddddii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiidddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiidddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiidddddd(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viidddddd(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diiidi(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diidi(index,a1,a2,a3,a4){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_ddii(index,a1,a2,a3){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_ddi(index,a1,a2){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iidd(index,a1,a2,a3){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiidid(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiddi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiddddd(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiddddddd(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiidddid(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiddidddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiidddddi(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiidddi(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiddiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiddidi(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiddd(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiddddd(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiidddddddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiidd(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiidddddddddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiddddddii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiddii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiddddddii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiddii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiidddddddddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiddid(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiddiddddi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiddddi(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiidiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vdiiii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vdiiiiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_idiiiiiid(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vdiiiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiidi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiddii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vdiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vdiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vdiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vdiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vdddiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vidiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vdiiidiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vdiidiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiidi(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiidi(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiidii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiddiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiddiiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viddiiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiidii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiidiiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiifiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiidi(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiidi(index,a1,a2,a3,a4,a5){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiddiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiddiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiifiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiifiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vidddiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_ddidddi(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiddiddiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiddiddiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiididdii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiididdii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiddiddiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiddiddiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viidddiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiidddddiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiddiddiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiddiddiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiidiiidd(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diiiii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diiii(index,a1,a2,a3,a4){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iidiid(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiddiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiddiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiddii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiidddi(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiidddi(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viidiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vidddii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viidddii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiddiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiddiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiddiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiidiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vddiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vddiiiiiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vddiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viidiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vdddiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiidddiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiddddddddiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiddddddddiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iddddiid(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vddiiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiidi(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiidddiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iidddiiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiidiiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiidiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiifiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viidiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vidiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viidiiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiidid(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iddddiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiidii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiidddi(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiidddi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiidddi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiddiiddd(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiidiidiid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiidiiid(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiididiiiiidd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iididiiiiidd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vdddii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viidddddddiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiid(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiidddddddddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iididd(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viidiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiidiiid(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiddiiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiddi(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiiiiiiiiidddiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28,a29,a30,a31,a32,a33){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28,a29,a30,a31,a32,a33)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiiiiiiiidddiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28,a29,a30,a31,a32){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28,a29,a30,a31,a32)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiiiidddiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiiidddiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiiidddiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiidddiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiiiiiiiiiddiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28,a29,a30,a31,a32){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28,a29,a30,a31,a32)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiiiiiiiiddiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28,a29,a30,a31){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28,a29,a30,a31)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiiiiddiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiiiddiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iidiii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiddddidd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiddidd(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28,a29,a30,a31,a32,a33,a34,a35,a36,a37,a38,a39,a40,a41){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28,a29,a30,a31,a32,a33,a34,a35,a36,a37,a38,a39,a40,a41)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiidddiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiddddiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiididdi(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iididdi(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiidiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiddiiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiididi(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiidiiidi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiididi(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vdiddiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiidddidi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiidididddddddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiidiiiddddddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiddiddiddddddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiidiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiddii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiddii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiidii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiddiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiddiiid(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiid(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viidiiid(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiddiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viddiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiidddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iidfdf(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiidiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diiiidd(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vddiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vddiiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiidii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiddii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiidi(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiddiddidii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiddidddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiididd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_didiii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiddiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiddiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiidddddddii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diidiidii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_ddiidii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diidiidiiddi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_ddiidiiddi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diiiidii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diidii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diiiidiiddi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diidiiddi(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diiiidiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diidiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiid(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diiidii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiidiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iidddidiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiddiidi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiidiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiidddid(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiddddddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiidiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiidiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiidiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vddiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_idiiiiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiddi(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiidddii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viddddii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiidi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiiiiiid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vddiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vddiiiiiiiiiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vddddiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vddii(index,a1,a2,a3,a4){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiidi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiiiiid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiddd(index,a1,a2,a3,a4,a5){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iidid(index,a1,a2,a3,a4){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_d(index){var sp=stackSave();try{return getWasmTableEntry(index)()}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vidddidddddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_did(index,a1,a2){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiddddiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28,a29,a30,a31,a32,a33,a34,a35,a36,a37,a38,a39,a40){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28,a29,a30,a31,a32,a33,a34,a35,a36,a37,a38,a39,a40)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vidd(index,a1,a2,a3){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viddd(index,a1,a2,a3,a4){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiddiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viddidddiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiddi(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diiddd(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viidddd(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiidd(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vidfdfii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiidfdf(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiidd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiidddd(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiidddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viididd(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_dd(index,a1){var sp=stackSave();try{return getWasmTableEntry(index)(a1)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiiiiddiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiidiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiiiiiiiiidddiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iidddddd(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viifff(index,a1,a2,a3,a4,a5){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiif(index,a1,a2,a3,a4){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiddddi(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vidddi(index,a1,a2,a3,a4,a5){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiidd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiddidi(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiddiiid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viidid(index,a1,a2,a3,a4,a5){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vidddddd(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vddi(index,a1,a2,a3){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vdiddddi(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_didd(index,a1,a2,a3){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiddddidd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vidddd(index,a1,a2,a3,a4,a5){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viif(index,a1,a2,a3){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vdi(index,a1,a2){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_ididi(index,a1,a2,a3,a4){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viddddd(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiddi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_didi(index,a1,a2,a3){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiiiid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiiiidid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiiiidididididid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiidididididid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiidididididid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiiiidididid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiddddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiiiididididid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiidddddidid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiididid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiiidid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiiiidididididididididididid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28,a29,a30,a31,a32,a33,a34,a35,a36,a37,a38){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28,a29,a30,a31,a32,a33,a34,a35,a36,a37,a38)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiddd(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiidddddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiidddddi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiidddddddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viidddiid(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiddddiiid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiidi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iidddddddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiddddddi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iddiidii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiidiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiddiiiddii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vidiiidi(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viidiid(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiidiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiddiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiddiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiidiiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiddddi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiidddddddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiidiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiddiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vidid(index,a1,a2,a3,a4){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiidiidid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vdiii(index,a1,a2,a3,a4){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiidiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiidd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiidddddddddiiddii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiddddi(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiddi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiidddd(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiidddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viidddddddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiidddi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiidddiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiidid(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vidddddi(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_didddddidi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diiddi(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_didddidi(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiidiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiddidiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiddd(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_didiiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiddddii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiddiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiddi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viddddddd(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iidiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vidddddddii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_ddd(index,a1,a2){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiddddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiidddddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiddddd(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iddiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiidiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiidiiiiddiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiddid(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiididi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diiiiidiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiddddidd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiddi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viddddiid(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiiidddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiiiid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiddiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vidiiiiidd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iddiii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiidiid(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiidiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iididiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiddddi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vidddddddddddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iidiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iifff(index,a1,a2,a3,a4){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viidiiidddii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiidddii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viddiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiddiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_idii(index,a1,a2,a3){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiidddiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iidddiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iidddiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viddddddiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diiiiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiidiiiiiid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diidd(index,a1,a2,a3,a4){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiidii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_idiid(index,a1,a2,a3,a4){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vidddiiidi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iidiiddiid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiddddii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vdddiiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viddiiddi(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iidddiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiddiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiddii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiidddiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiidddiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iidiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vdiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vddiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vidiiiddii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iididi(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiidddddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iidddii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viidddi(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiddiidiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiddiidd(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viddiiddiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viffff(index,a1,a2,a3,a4,a5){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiif(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viifiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viifi(index,a1,a2,a3,a4){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_dddiiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiid(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiidi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_idiiid(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vddiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_idi(index,a1,a2){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiddididdi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiidii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiiiddddiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiiiddddiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiidiiiid(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiddidi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiidddiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diiiddi(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiidiiiidd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiddidi(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diidiiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diiidiiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diiiid(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viidiiidii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiidii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viidiiiiidiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiiiddddiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiidiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiddii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vididi(index,a1,a2,a3,a4,a5){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iidddid(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiidddii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiidiiiiiidiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiddiiiiiiddiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiidiidi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_didiiiiidi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiiiiiiddddiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiiiiiiiiiddddiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28,a29,a30){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28,a29,a30)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiiiiddddiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28,a29){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28,a29)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiiiiiiiddddiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiiiiiiiiiiddddiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28,a29,a30,a31){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28,a29,a30,a31)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iidiiiidiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiddiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiidiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiiiiiiddi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiddddiddi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiddddiddi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiddddiddi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viddddiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiidiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiiiiiiddiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28,a29,a30){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28,a29,a30)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiddiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiidid(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiddidd(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diddd(index,a1,a2,a3,a4){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiddddidd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viididi(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiididi(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiidddii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiddiiid(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viididdi(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vdidiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiidddiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiididi(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiidiiidi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiidddddiiidddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viddddiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iddii(index,a1,a2,a3,a4){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiddiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiidiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iidiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiidiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiidiidiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vddddddi(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiddiiid(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vdddddi(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_ddidd(index,a1,a2,a3,a4){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiddiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iidiiiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiddiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiddiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diddi(index,a1,a2,a3,a4){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iddddiddi(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viidddidi(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iddddidddd(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diiiiiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiidii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiddiidiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiddiididii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiddiiddiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiiddiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiddii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiddiiddiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiiddiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiddiiddiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiddidiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iididdii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiiidii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_dididd(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiddid(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_diddiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_idddii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viddddi(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_ididiiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iddiddiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiddddidii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viidddddi(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_didii(index,a1,a2,a3,a4){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viidddiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_idiiididii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viddiididiiiiiiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiidiiiidiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiddiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiddiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiiiddidiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vddiii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{getWasmTableEntry(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiiiddiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{return getWasmTableEntry(index)(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iijii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return dynCall_iijii(index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiij(index,a1,a2,a3,a4){var sp=stackSave();try{return dynCall_iiij(index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiijj(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return dynCall_iiijj(index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiiji(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{dynCall_viiiiji(index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiji(index,a1,a2,a3,a4){var sp=stackSave();try{return dynCall_iiji(index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vjj(index,a1,a2,a3,a4){var sp=stackSave();try{dynCall_vjj(index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viijii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{dynCall_viijii(index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiji(index,a1,a2,a3,a4,a5){var sp=stackSave();try{dynCall_viiji(index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiiij(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{dynCall_viiiij(index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_ji(index,a1){var sp=stackSave();try{return dynCall_ji(index,a1)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viij(index,a1,a2,a3,a4){var sp=stackSave();try{dynCall_viij(index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_viiijj(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{dynCall_viiijj(index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iij(index,a1,a2,a3){var sp=stackSave();try{return dynCall_iij(index,a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_vji(index,a1,a2,a3){var sp=stackSave();try{dynCall_vji(index,a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}function invoke_iiiiij(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return dynCall_iiiiij(index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0)throw e;_setThrew(1,0)}}Module["FS"]=FS;var calledRun;function ExitStatus(status){this.name="ExitStatus";this.message="Program terminated with exit("+status+")";this.status=status}dependenciesFulfilled=function runCaller(){if(!calledRun)run();if(!calledRun)dependenciesFulfilled=runCaller};function run(args){args=args||arguments_;if(runDependencies>0){return}preRun();if(runDependencies>0){return}function doRun(){if(calledRun)return;calledRun=true;Module["calledRun"]=true;if(ABORT)return;initRuntime();readyPromiseResolve(Module);if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(function(){setTimeout(function(){Module["setStatus"]("")},1);doRun()},1)}else{doRun()}}Module["run"]=run;function exit(status,implicit){EXITSTATUS=status;procExit(status)}function procExit(code){EXITSTATUS=code;if(!keepRuntimeAlive()){if(Module["onExit"])Module["onExit"](code);ABORT=true}quit_(code,new ExitStatus(code))}if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}run();


  return Module.ready
}
);
})();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Module);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   commandExecutor: () => (/* binding */ commandExecutor),
/* harmony export */   geometry: () => (/* reexport safe */ _common_geometry_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   nodeCalculator: () => (/* binding */ nodeCalculator),
/* harmony export */   testCompounds: () => (/* reexport safe */ _tests_testOperations__WEBPACK_IMPORTED_MODULE_4__.testCompounds),
/* harmony export */   testDifference: () => (/* reexport safe */ _tests_testOperations__WEBPACK_IMPORTED_MODULE_4__.testDifference),
/* harmony export */   testUnion: () => (/* reexport safe */ _tests_testOperations__WEBPACK_IMPORTED_MODULE_4__.testUnion)
/* harmony export */ });
/* harmony import */ var opencascade_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! opencascade.js */ "./node_modules/opencascade.js/dist/index.js");
/* harmony import */ var _common_createPromise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./common/createPromise */ "./src/common/createPromise.js");
/* harmony import */ var _common_geometry_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./common/geometry.js */ "./src/common/geometry.js");
/* harmony import */ var _csg_csgNodeCalculator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./csg/csgNodeCalculator */ "./src/csg/csgNodeCalculator.js");
/* harmony import */ var _tests_testOperations__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./tests/testOperations */ "./src/tests/testOperations.js");
/* harmony import */ var _commands_commandExecutor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./commands/commandExecutor */ "./src/commands/commandExecutor.ts");
//// console.log("executing webpack-numbers index.js");








var nodeCalculator = new _csg_csgNodeCalculator__WEBPACK_IMPORTED_MODULE_3__["default"](_common_geometry_js__WEBPACK_IMPORTED_MODULE_2__["default"]);

var commandExecutor = new _commands_commandExecutor__WEBPACK_IMPORTED_MODULE_5__.CommandExecutor(_common_geometry_js__WEBPACK_IMPORTED_MODULE_2__["default"], nodeCalculator);

try {
    //// console.log("global scope start...")
    //// console.log("window is ", window)
    //// console.log("this is ", this)
}
catch (e) {
    console.error("error when checking global window refs: ", e);
}
try {
    var window = __webpack_require__.g;
    if (window === undefined) {
        //// console.log("window is undefined, setting window to 'this'")
        window = undefined;
    }
}
catch (e) {
    console.error("error when setting global window ref: ", e);
}
var globalScope = undefined;
if (globalScope === undefined) {
    //// console.log("this is undefined, setting globalScope to 'window'")
    globalScope = window;
}
//// console.log("globalScope is ", globalScope)
//// console.log("globalScope === this is ", globalScope === this)
//// console.log("globalScope === window is ", globalScope === window)
function initIntoScope(scope) {
    // console.log("init called, scope: ",scope);
    // console.log("initOpenCascade is: ",initOpenCascade);
    var promise = (0,_common_createPromise__WEBPACK_IMPORTED_MODULE_1__.createPromise)();
    (0,opencascade_js__WEBPACK_IMPORTED_MODULE_0__["default"])()
        .then(function (openCascade) {
        //// console.log("open cascade initialised, openCascade: ", openCascade)
        //// console.log("open cascade initialised, scope: ", scope)
        // console.log("openCascade OCJS: "+openCascade.OCJS)
        _common_geometry_js__WEBPACK_IMPORTED_MODULE_2__["default"].setOpenCascade(openCascade);
        scope.openCascade = openCascade;
    })
        .then(promise.resolve)
        .catch(promise.reject);
    // promise.reject("EEERRRROOOORRRR")
    return promise;
}
function init() {
    return initIntoScope(globalScope);
}
// init()
//     .then(() => {
//         //// console.log("init is done.")
//     })

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=webpack-numbers.js.map