// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "BJJChecklist",
    defaultLocalization: "pt-BR",
    platforms: [
        .iOS(.v17),
        .macOS(.v14)
    ],
    products: [
        .library(
            name: "BJJChecklist",
            targets: ["BJJChecklist"]
        )
    ],
    targets: [
        .target(
            name: "BJJChecklist",
            path: "Sources/BJJChecklist",
            resources: [
                .process("Resources")
            ]
        ),
        .testTarget(
            name: "BJJChecklistTests",
            dependencies: ["BJJChecklist"],
            path: "Tests/BJJChecklistTests"
        )
    ]
)
