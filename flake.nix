{
  description = "thegadfly.news";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = nixpkgs.legacyPackages.${system};
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            jekyll

            # Plugins declared in _config.yml
            rubyPackages.jekyll-feed
            rubyPackages.jekyll-seo-tag
            rubyPackages.webrick
          ];
        };
      });
}

