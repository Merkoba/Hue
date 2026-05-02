{
  description = "Development environment for the hue node application";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {self, nixpkgs, flake-utils}:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        rubyEnv = pkgs.ruby.withPackages (ps: [
          ps.git
        ]);
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.nodejs_22
            pkgs.git
            pkgs.gh
            rubyEnv
          ];

          shellHook = ''
            echo "Hue development environment loaded."
            echo "Node: $(node --version)"
            echo "Ruby: $(ruby --version)"
          '';
        };
      }
    );
}